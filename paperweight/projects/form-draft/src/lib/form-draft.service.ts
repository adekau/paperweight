import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractFormGroup } from 'projects/contracts/src/lib/abstract-form-group';
import { AbstractFormControl, IFormDraftOptions } from 'projects/contracts/src/public-api';
import { identity, interval, Observable, of, throwError } from 'rxjs';
import { debounce, distinctUntilChanged, flatMap, map, pluck, switchMap, takeWhile, tap } from 'rxjs/operators';

import { IndexedDBService } from './indexed-db.service';
import { FormDraftQuery } from './queries/form-draft.query';
import { FormDraftStore } from './stores/form-draft.store';

export const FORM_DRAFT_OPTIONS = new InjectionToken<IFormDraftOptions>('FORM_DRAFT_OPTIONS');

@Injectable({
    providedIn: 'root'
})
export class FormDraftService {

    constructor(
        private idbService: IndexedDBService,
        private formDraftStore: FormDraftStore,
        private formDraftQuery: FormDraftQuery,
        @Optional() @Inject(FORM_DRAFT_OPTIONS) private formDraftOptions: IFormDraftOptions
    ) { }

    public saveDraftAsync<T>(formIdentifier: string, draft: T): Observable<IDBValidKey> {
        return this.idbService.put({ id: formIdentifier, ...draft });
    }

    public getDraftAsync(formIdentifier: IDBValidKey): Observable<any> {
        return this.idbService.get(formIdentifier);
    }

    public getAllDraftsAsync(): Observable<any> {
        return this.idbService.getAll();
    }

    public getForm(formName: string): Observable<AbstractFormGroup> {
        return this.formDraftQuery.forms$
            .pipe(
                map(state => state.forms[formName])
            );
    }

    public hasForm(formName: string): boolean {
        return !!this.formDraftQuery.getValue().forms[formName];
    }

    public selectHasForm(formName: string): Observable<boolean> {
        return this.formDraftQuery.forms$
            .pipe(
                map(state => !!state.forms[formName])
            );
    }

    public clearAllDrafts(): Observable<void> {
        return this.idbService.clearAll();
    }

    /**
     * Gets a debounced observable emits when the form value changes.
     * @param formName The form's unique identifier
     */
    public getValueChanges(formName: string, debounceInterval: number = 0): Observable<any> {
        return this.getForm(formName)
            .pipe(
                takeWhile(() => this.hasForm(formName)),
                switchMap(form => form.valueChanges),
                (
                    debounceInterval
                        ? debounce(() => interval(debounceInterval))
                        // no-op if debounceInterval = 0
                        : identity
                )
            );
    }

    public getAllFormControls(formName: string): Observable<AbstractFormGroup['controls']> {
        return this.getForm(formName)
            .pipe(
                pluck('controls')
            );
    }

    public getFormControl(formName: string, path: string): Observable<AbstractFormControl> {
        return this.getAllFormControls(formName)
            .pipe(
                this.resolveFormControl(path),
                distinctUntilChanged(deepCompare())
            );
    }

    public setDisabled(control: AbstractFormControl, disabled: boolean, emitEvent: boolean = false): Observable<AbstractFormControl> {
        (control as FormControl)[disabled ? 'disable' : 'enable']({
            emitEvent
        });
        return of(control);
    }

    private resolveFormControl(path: string | string[]) {
        return (source: Observable<AbstractFormGroup['controls']>): Observable<AbstractFormControl> => {
            const [first, ...rest] = Array.isArray(path)
                ? path
                : path.split('.');

            if (!rest.length) {
                return source.pipe(
                    map(all => all[first])
                );
            }

            return source.pipe(
                flatMap(all => Object.prototype.hasOwnProperty.call(all[first], 'controls')
                    ? of((all[first] as AbstractFormGroup).controls)
                    : throwError('Form control path was expecting a form group.')),
                this.resolveFormControl(rest)
            );
        };
    }

    public register(formIdentifier: string, form: AbstractFormGroup): Observable<string> {
        if (this.hasForm(formIdentifier)) {
            console.warn('A form has already been registered with identifier', formIdentifier);
            return throwError('A form has already been registered with identifier' + formIdentifier);
        }

        return of<string>(this.formDraftStore.update({
            forms: {
                [formIdentifier]: form
            },

            subscriptions: {
                [formIdentifier]: form.valueChanges
                    .pipe(
                        debounce(() => interval(this.formDraftOptions ? this.formDraftOptions.debounceInterval : 3000)),
                        switchMap(v => this.saveDraftAsync(formIdentifier, v))
                    )
                    .subscribe()
            }
        }))
            .pipe(
                map(() => formIdentifier)
            );
    }

    public unregister(formIdentifier: string): Observable<void> {
        if (!this.hasForm(formIdentifier)) {
            console.warn('No form is registered with identifier', formIdentifier);
            return throwError('No form is registered with identifier' + formIdentifier);
        }

        return this.formDraftQuery
            .select()
            .pipe(
                tap(state =>
                    state.subscriptions[formIdentifier]
                        ? state.subscriptions[formIdentifier].unsubscribe()
                        : void 0
                ),
                map(() => {
                    return this.formDraftStore.update(state => ({
                        forms: {
                            ...(state.forms || {}),
                            [formIdentifier]: undefined
                        },

                        subscriptions: {
                            ...(state.subscriptions || {}),
                            [formIdentifier]: undefined
                        }
                    }));
                })
            );
    }

    public getRegisteredForms(): Observable<AbstractFormGroup[]> {
        return this.formDraftQuery.forms$
            .pipe(
                map(state => Object.keys(state.forms).map(key => state.forms[key]))
            );
    }
}

function deepCompare() {
    return (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);
}
