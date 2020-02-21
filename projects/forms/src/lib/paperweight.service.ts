import { Inject, Injectable, Optional } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { AbstractFormGroup } from 'projects/contracts/src/lib/abstract-form-group';
import { AbstractFormControl, IPaperweightOptions } from 'projects/contracts/src/public-api';
import { deepCompare } from 'projects/utility/src/public-api';
import { identity, iif, Observable, of, throwError } from 'rxjs';
import { debounceTime, distinctUntilChanged, flatMap, map, switchMap, takeWhile, tap } from 'rxjs/operators';

import { FormInteractionExpression } from './form-interaction-expression';
import { IndexedDBService } from './indexed-db.service';
import { PAPERWEIGHT_OPTIONS } from './paperweight-options';
import { PaperweightQuery } from './queries/form-draft.query';
import { PaperweightStore } from './stores/form-draft.store';
import { GetForm, FormDraft, FormNames, PaperweightSchema } from './types';

@Injectable({
    providedIn: 'root'
})
export class PaperweightService<RegisteredForms extends PaperweightSchema = unknown> {
    constructor(
        private _idbService: IndexedDBService,
        private _paperweightStore: PaperweightStore,
        private _paperweightQuery: PaperweightQuery,
        @Optional() @Inject(PAPERWEIGHT_OPTIONS) private _paperweightOptions: IPaperweightOptions
    ) { }

    public saveDraftAsync<TFormName extends FormNames<RegisteredForms>, T>(
        formIdentifier: TFormName,
        draft: T
    ): Observable<IDBValidKey> {
        return this._idbService.put({ id: formIdentifier, ...draft });
    }

    public deleteDraftAsync<TFormName extends FormNames<RegisteredForms>>(
        formIdentifier: TFormName
    ): Observable<void> {
        return this._idbService.delete(formIdentifier);
    }

    public getDraftAsync<TFormName extends FormNames<RegisteredForms>>(
        formIdentifier: TFormName
    ): Observable<FormDraft<RegisteredForms, TFormName>> {
        return this._idbService.get(formIdentifier);
    }

    public getAllDraftsAsync(): Observable<FormDraft<RegisteredForms, FormNames<RegisteredForms>>[]> {
        return this._idbService.getAll();
    }

    public clearAllDrafts(): Observable<void> {
        return this._idbService.clearAll();
    }

    public createExpression(): FormInteractionExpression<RegisteredForms> {
        return new FormInteractionExpression<RegisteredForms>(this);
    }

    /**
     * Gets a debounced observable emits when the form value changes.
     * @param formName The form's unique identifier
     */
    public getValueChanges<TFormName extends FormNames<RegisteredForms>>(
        formName: TFormName,
        debounceInterval: number = 0
    ): Observable<GetForm<RegisteredForms, TFormName>> {
        return this._paperweightQuery.getForm(formName)
            .pipe(
                takeWhile(() => this._paperweightQuery.hasFormSync(formName)),
                switchMap(form => form.valueChanges),
                (
                    debounceInterval
                        ? debounceTime(debounceInterval)
                        // do nothing if debounceInterval = 0
                        : identity
                ),
                distinctUntilChanged(deepCompare()),
            );
    }

    public getControlValueChanges<TFormName extends FormNames<RegisteredForms>>(
        formName: TFormName,
        path: string | string[],
        debounceInterval?: number
    ): Observable<any>;
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
                ),
                distinctUntilChanged(deepCompare())
            );
    }

    public getAllFormControls<TFormName extends FormNames<RegisteredForms>>(
        formName: TFormName
    ): Observable<AbstractFormGroup['controls']> {
        return this._paperweightQuery.getForm(formName)
            .pipe(
                flatMap(form => iif(
                    () => !!form && !!form.controls,
                    of(form?.controls || {}),
                    throwError(`Form [${formName}] is not registered or no longer exists.`)
                ))
            );
    }

    public getFormControl<TFormName extends FormNames<RegisteredForms>>(
        formName: TFormName,
        path: string | string[]
    ): Observable<AbstractFormControl> {
        return this.getAllFormControls(formName)
            .pipe(
                this._resolveFormControl(path),
                distinctUntilChanged(deepCompare())
            );
    }

    public setDisabled<TFormName extends FormNames<RegisteredForms>>(
        formName: TFormName,
        path: string | string[],
        disabled: boolean,
        emitEvent?: boolean
    ): Observable<AbstractFormControl>;
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

    public setValue<TFormName extends FormNames<RegisteredForms>, T>(
        formName: TFormName,
        path: string | string[],
        value: T
    ): Observable<AbstractFormControl>;
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

    public reset<TFormName extends FormNames<RegisteredForms>, T = never>(
        formName: TFormName,
        path: string | string[],
        value?: T
    ): Observable<AbstractFormControl>;
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

    public isRequired<TFormName extends FormNames<RegisteredForms>>(
        formName: TFormName,
        path: string | string[]
    ): Observable<boolean>;
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

    public setValidators<TFormName extends FormNames<RegisteredForms>>(
        formName: TFormName,
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
            return this.getFormControl(args[0] as any, args[1] as any);
        else if (args[0] instanceof Observable)
            return args[0];
        else
            return of(args[0]);
    }

    public register<TId extends FormNames<RegisteredForms>>(
        formIdentifier: TId,
        form: AbstractFormGroup
    ): Observable<TId> {
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

    public unregister<TId extends FormNames<RegisteredForms>>(
        formIdentifier: TId
    ): Observable<void> {
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
