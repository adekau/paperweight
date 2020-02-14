import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { AbstractFormGroup } from 'projects/contracts/src/lib/abstract-form-group';
import { AbstractFormControl, IFormDraftOptions } from 'projects/contracts/src/public-api';
import { deepCompare } from 'projects/utility/src/public-api';
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
        private _idbService: IndexedDBService,
        private _formDraftStore: FormDraftStore,
        private _formDraftQuery: FormDraftQuery,
        @Optional() @Inject(FORM_DRAFT_OPTIONS) private _formDraftOptions: IFormDraftOptions
    ) { }

    public saveDraftAsync<T>(formIdentifier: string, draft: T): Observable<IDBValidKey> {
        return this._idbService.put({ id: formIdentifier, ...draft });
    }

    public deleteDraftAsync(formIdentifier: IDBValidKey): Observable<any> {
        return this._idbService.delete(formIdentifier);
    }

    public getDraftAsync(formIdentifier: IDBValidKey): Observable<any> {
        return this._idbService.get(formIdentifier);
    }

    public getAllDraftsAsync(): Observable<any> {
        return this._idbService.getAll();
    }

    public clearAllDrafts(): Observable<void> {
        return this._idbService.clearAll();
    }

    /**
     * Gets a debounced observable emits when the form value changes.
     * @param formName The form's unique identifier
     */
    public getValueChanges(formName: string, debounceInterval: number = 0): Observable<any> {
        return this._formDraftQuery.getForm(formName)
            .pipe(
                takeWhile(() => this._formDraftQuery.hasFormSync(formName)),
                switchMap(form => form.valueChanges),
                (
                    debounceInterval
                        ? debounce(() => interval(debounceInterval))
                        // do nothing if debounceInterval = 0
                        : identity
                )
            );
    }

    public getAllFormControls(formName: string): Observable<AbstractFormGroup['controls']> {
        return this._formDraftQuery.getForm(formName)
            .pipe(
                pluck('controls')
            );
    }

    public getFormControl(formName: string, path: string | string[]): Observable<AbstractFormControl> {
        return this.getAllFormControls(formName)
            .pipe(
                this._resolveFormControl(path),
                distinctUntilChanged(deepCompare())
            );
    }

    public setDisabled(formName: string, path: string | string[], disabled: boolean, emitEvent?: boolean): Observable<AbstractFormControl>;
    public setDisabled(control: AbstractFormControl, disabled: boolean, emitEvent?: boolean): Observable<AbstractFormControl>;
    public setDisabled(...args: any[]): Observable<AbstractFormControl> {
        const control = this._formControlOrResolve(...args);
        let disabled: boolean;
        let emitEvent: boolean;

        if (typeof args[0] === 'string') {
            disabled = args[2];
            emitEvent = !!args[3];
        } else {
            disabled = args[1];
            emitEvent = !!args[2];
        }

        return control
            .pipe(
                tap(con => (con as FormControl)[disabled ? 'disable' : 'enable']({
                    emitEvent
                }))
            );
    }

    public isRequired(formName: string, path: string | string[]): Observable<boolean>;
    public isRequired(control: AbstractFormControl): Observable<boolean>;
    public isRequired(...args: any[]): Observable<boolean> {
        const control = this._formControlOrResolve(...args);

        return control
            .pipe(
                map(con => (con as AbstractControl).validator
                    ? (con as AbstractControl).validator(con as AbstractControl)
                    : {}),
                map(ve => Object.prototype.hasOwnProperty.call(ve, 'required'))
            );
    }

    public setValidators(
        formName: string,
        path: string | string[],
        validators: ValidatorFn | ValidatorFn[]
    ): Observable<AbstractFormControl>;
    public setValidators(control: AbstractFormControl, validators: ValidatorFn | ValidatorFn[]): Observable<AbstractFormControl>;
    public setValidators(...args: any[]): Observable<AbstractFormControl> {
        const control: Observable<AbstractFormControl> = this._formControlOrResolve(...args);
        let validators: ValidatorFn | ValidatorFn[];

        if (typeof args[0] === 'string')
            validators = args[2];
        else
            validators = args[1];

        return control.pipe(
            tap(c => (c as AbstractControl).setValidators(validators))
        );
    }

    private _resolveFormControl(path: string | string[]) {
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
                this._resolveFormControl(rest)
            );
        };
    }

    private _formControlOrResolve(...args: any[]): Observable<AbstractFormControl> {
        if (typeof args[0] === 'string')
            return this.getFormControl(args[0], args[1]);
        else
            return of(args[0]);
    }

    public register(formIdentifier: string, form: AbstractFormGroup): Observable<string> {
        if (this._formDraftQuery.hasFormSync(formIdentifier)) {
            console.warn('A form has already been registered with identifier', formIdentifier);
            return throwError('A form has already been registered with identifier' + formIdentifier);
        }

        return of<string>(this._formDraftStore.update({
            forms: {
                [formIdentifier]: form
            },

            subscriptions: {
                [formIdentifier]: form.valueChanges
                    .pipe(
                        debounce(() => interval(
                            this._formDraftOptions
                                ? this._formDraftOptions.debounceInterval
                                : 3000)
                        ),
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
        if (!this._formDraftQuery.hasFormSync(formIdentifier)) {
            console.warn('No form is registered with identifier', formIdentifier);
            return throwError('No form is registered with identifier' + formIdentifier);
        }

        return this._formDraftQuery
            .select()
            .pipe(
                tap(state =>
                    state.subscriptions[formIdentifier]
                        ? state.subscriptions[formIdentifier].unsubscribe()
                        : void 0
                ),
                map(() => {
                    return this._formDraftStore.update(state => ({
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
        return this._formDraftQuery.forms$
            .pipe(
                map(forms => Object.keys(forms).map(key => forms[key]))
            );
    }
}
