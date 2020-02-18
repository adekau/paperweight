import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { AbstractFormGroup } from 'projects/contracts/src/lib/abstract-form-group';
import { AbstractFormControl, IFormDraftOptions as IPaperweightOptions } from 'projects/contracts/src/public-api';
import { deepCompare } from 'projects/utility/src/public-api';
import { identity, iif, Observable, of, throwError } from 'rxjs';
import { debounceTime, distinctUntilChanged, flatMap, map, pluck, switchMap, takeWhile, tap } from 'rxjs/operators';

import { FormInteractionExpression } from './form-interaction-expression';
import { IndexedDBService } from './indexed-db.service';
import { FormDraftQuery as PaperweightQuery } from './queries/form-draft.query';
import { FormDraftStore as PaperweightStore } from './stores/form-draft.store';

export const PAPERWEIGHT_OPTIONS = new InjectionToken<IPaperweightOptions>('FORM_DRAFT_OPTIONS');

@Injectable({
    providedIn: 'root'
})
export class PaperweightService {

    constructor(
        private _idbService: IndexedDBService,
        private _paperweightStore: PaperweightStore,
        private _paperweightQuery: PaperweightQuery,
        @Optional() @Inject(PAPERWEIGHT_OPTIONS) private _paperweightOptions: IPaperweightOptions
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

    public createExpression(): FormInteractionExpression {
        return new FormInteractionExpression(this);
    }

    /**
     * Gets a debounced observable emits when the form value changes.
     * @param formName The form's unique identifier
     */
    public getValueChanges(formName: string, debounceInterval: number = 0): Observable<any> {
        return this._paperweightQuery.getForm(formName)
            .pipe(
                takeWhile(() => this._paperweightQuery.hasFormSync(formName)),
                switchMap(form => form.valueChanges),
                (
                    debounceInterval
                        ? debounceTime(debounceInterval)
                        // do nothing if debounceInterval = 0
                        : identity
                )
            );
    }

    public getControlValueChanges(formName: string, path: string | string[], debounceInterval?: number): Observable<any>;
    public getControlValueChanges(
        control: Observable<AbstractFormControl> | AbstractFormControl,
        debounceInterval?: number
    ): Observable<any>;
    public getControlValueChanges(...args: any[]): Observable<any> {
        const control = this._formControlOrResolve(...args);
        let debounceInterval: number;

        if (typeof args[0] === 'string')
            debounceInterval = args[2] || 0;
        else
            debounceInterval = args[1] || 0;

        return control
            .pipe(
                switchMap(c => (c as AbstractControl).valueChanges),
                (
                    debounceInterval
                        ? debounceTime(debounceInterval)
                        : identity
                )
            );
    }


    public getAllFormControls(formName: string): Observable<AbstractFormGroup['controls']> {
        return this._paperweightQuery.getForm(formName)
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
                tap(con => (con as AbstractControl)[disabled ? 'disable' : 'enable']({
                    emitEvent
                }))
            );
    }

    public setValue<T>(formName: string, path: string | string[], value: T): Observable<AbstractFormControl>;
    public setValue<T>(control: AbstractFormControl, value: T): Observable<AbstractFormControl>;
    public setValue(...args: any[]): Observable<AbstractFormControl> {
        const control = this._formControlOrResolve(...args);
        let value: any;

        if (typeof args[0] === 'string')
            value = args[2];
        else
            value = args[1];

        return control
            .pipe(
                tap(con => (con as AbstractControl).setValue(value))
            );
    }

    public reset<T = never>(formName: string, path: string | string[], value?: T): Observable<AbstractFormControl>;
    public reset<T = never>(control: AbstractFormControl, value?: T): Observable<AbstractFormControl>;
    public reset(...args: any[]): Observable<AbstractFormControl> {
        const control = this._formControlOrResolve(...args);
        let value: any;

        if (typeof args[0] === 'string')
            value = args[2];
        else
            value = args[1];

        return control
            .pipe(
                tap(con => (con as AbstractControl).reset(value))
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
                flatMap(all => iif(
                    () => Object.prototype.hasOwnProperty.call(all[first], 'controls'),
                    of((all[first] as AbstractFormGroup).controls),
                    throwError('Form control path was expecting a form group.')
                )),
                this._resolveFormControl(rest)
            );
        };
    }

    private _formControlOrResolve(...args: any[]): Observable<AbstractFormControl> {
        if (typeof args[0] === 'string')
            return this.getFormControl(args[0], args[1]);
        else if (args[0] instanceof Observable)
            return args[0];
        else
            return of(args[0]);
    }

    public register(formIdentifier: string, form: AbstractFormGroup): Observable<string> {
        if (this._paperweightQuery.hasFormSync(formIdentifier)) {
            console.warn('A form has already been registered with identifier', formIdentifier);
            return throwError('A form has already been registered with identifier' + formIdentifier);
        }

        return of<string>(this._paperweightStore.update(state => ({
            forms: {
                ...(state.forms || {}),
                [formIdentifier]: form
            },

            subscriptions: {
                ...(state.subscriptions || {}),
                [formIdentifier]: form.valueChanges
                    .pipe(
                        debounceTime(
                            this._paperweightOptions
                                ? this._paperweightOptions.debounceInterval
                                : 3000
                        ),
                        switchMap(v => this.saveDraftAsync(formIdentifier, v))
                    )
                    .subscribe()
            }
        })))
            .pipe(
                map(() => formIdentifier)
            );
    }

    public unregister(formIdentifier: string): Observable<void> {
        if (!this._paperweightQuery.hasFormSync(formIdentifier)) {
            console.warn('No form is registered with identifier', formIdentifier);
            return throwError('No form is registered with identifier' + formIdentifier);
        }

        return this._paperweightQuery
            .select()
            .pipe(
                tap(state =>
                    state.subscriptions[formIdentifier]
                        ? state.subscriptions[formIdentifier].unsubscribe()
                        : void 0
                ),
                map(() => {
                    return this._paperweightStore.update(state => ({
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
        return this._paperweightQuery.forms$
            .pipe(
                map(forms => Object.keys(forms).map(key => forms[key]))
            );
    }
}
