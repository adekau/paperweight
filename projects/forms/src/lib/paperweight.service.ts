import { Inject, Injectable, Optional } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { AbstractFormGroup } from 'projects/contracts/src/lib/abstract-form-group';
import { AbstractFormControl, IDraftSaveEvent, IPaperweightOptions } from 'projects/contracts/src/public-api';
import { deepCompare } from 'projects/utility/src/public-api';
import { combineLatest, identity, iif, Observable, of, throwError } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, flatMap, map, switchMap, takeWhile, tap } from 'rxjs/operators';

import { FormInteractionExpression } from './form-interaction-expression';
import { IndexedDBService } from './indexed-db.service';
import { PAPERWEIGHT_OPTIONS } from './paperweight-options';
import { PaperweightQuery } from './queries/form-draft.query';
import { PaperweightStore } from './stores/form-draft.store';
import { FormDraft, FormNames, GetForm, PaperweightSchema } from './types';
import { ControlResolver, control } from './control-selector';

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

    /**
     * Saves a draft in the database and returns an observable that emits the unique id it saved with.
     * @param formIdentifier The identifier to store the form as in the database.
     * @param draft The form state
     */
    public saveDraftAsync<TFormName extends FormNames<RegisteredForms>, T>(
        formIdentifier: TFormName,
        draft: T
    ): Observable<IDBValidKey> {
        return this._idbService.put({ id: formIdentifier, ...draft })
            .pipe(
                tap(() => this._paperweightQuery.getValue().draftSave$.next({
                    formName: formIdentifier
                }))
            );
    }

    /**
     * Deletes the stored draft for a form.
     * @param formIdentifier Name of the form to delete the current draft for.
     */
    public deleteDraftAsync<TFormName extends FormNames<RegisteredForms>>(
        formIdentifier: TFormName
    ): Observable<void> {
        return this._idbService.delete(formIdentifier);
    }

    /**
     * Emits the stored draft for a form.
     * @param formIdentifier Name of the form to get the current draft for.
     */
    public getDraftAsync<TFormName extends FormNames<RegisteredForms>>(
        formIdentifier: TFormName
    ): Observable<FormDraft<RegisteredForms, TFormName>> {
        return this._idbService.get(formIdentifier);
    }

    /**
     * Emits all drafts in the database as an array.
     */
    public getAllDraftsAsync(): Observable<FormDraft<RegisteredForms, FormNames<RegisteredForms>>[]> {
        return this._idbService.getAll();
    }

    /**
     * Clears all drafts stored in the database.
     */
    public clearAllDrafts(): Observable<void> {
        return this._idbService.clearAll();
    }

    public createExpression(): FormInteractionExpression<RegisteredForms> {
        return new FormInteractionExpression<RegisteredForms>(this);
    }

    /**
     * Returns an observable that, when subscribed to, loads the current saved draft into the form.
     * @param formName Name of a registered form.
     */
    public loadDraft<TFormName extends FormNames<RegisteredForms>>(
        formName: TFormName,
        opts?: { emitEvent: boolean; }
    ): Observable<void> {
        return this._paperweightQuery.getForm(formName)
            .pipe(
                switchMap(form => combineLatest([of(form), this.getDraftAsync(formName)])),
                map(([form, draft]: [FormGroup, FormDraft<RegisteredForms, TFormName>]) =>
                    (delete draft.id, (form as FormGroup).patchValue({
                        ...draft
                    }, {
                        onlySelf: true,
                        ...(opts || { emitEvent: false })
                    }))
                )
            );
    }

    /**
     * Returns an observable that emits when a draft for form `formName` is saved.
     * @param formName Name of a registered form
     */
    draftSaves<TFormName extends FormNames<RegisteredForms>>(
        formName: TFormName
    ): Observable<IDraftSaveEvent> {
        return this._paperweightQuery.getValue().draftSave$
            .pipe(
                filter(ev => ev.formName === formName)
            );
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

    /**
     * Returns an observable that emits on an optional debounce timer with changes in a form control's value.
     * @param formName Name of the form registered in Paperweight.
     * @param path `.` separated path to the form control, e.g. `height.feet`
     * @param debounceInterval Number (in milliseconds) interval to debounce the emissions from the observable.
     */
    public getControlValueChanges<TFormName extends FormNames<RegisteredForms>>(
        formName: TFormName,
        path: string | string[],
        debounceInterval?: number
    ): Observable<any>;
    /**
     * Returns an observable that emits on an optional debounce timer with changes in a form control's value.
     * @param control A form control to debounce valueChanges on.
     * @param debounceInterval Number (in milliseconds) interval to debounce the emissions from the observable.
     */
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

    /**
     * Emits an object keyed by the name of the form control.
     * @param formName The registered form name in Paperweight.
     */
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

    /**
     * Emits the a form control.
     * @param formName Name of the registered form in Paperweight.
     * @param path `.` separated path to the form control, e.g. `height.feet`
     */
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

    /**
     * Observable that returns the form control in a disabled or enabled state.
     * @param formName Name of the registered form in Paperweight.
     * @param controlResolver Function chain to resolve a form control in a strong-typed way from the form schema interface.
     * @param disabled Boolean of whether to set it to disabled or enabled.
     * @param emitEvent Boolean of whether to emit on the valueChange observable.
     */
    public setDisabled<TFormName extends FormNames<RegisteredForms>>(
        formName: TFormName,
        controlResolver: (resolver: ControlResolver<RegisteredForms[TFormName]>) => ControlResolver<unknown>,
        disabled: boolean,
        emitEvent?: boolean
    ): Observable<AbstractFormControl>;
    /**
     * Observable that returns the form control in a disabled or enabled state.
     * @param formName Name of the registered form in Paperweight.
     * @param path `.` separated path to the form control, e.g. `height.feet`
     * @param disabled Boolean of whether to set it to disabled or enabled.
     * @param emitEvent Boolean of whether to emit on the valueChange observable.
     */
    public setDisabled<TFormName extends FormNames<RegisteredForms>>(
        formName: TFormName,
        path: string | string[],
        disabled: boolean,
        emitEvent?: boolean
    ): Observable<AbstractFormControl>;
    /**
     * Observable that returns the form control in a disabled or enabled state.
     * @param control A form control enable or disable.
     * @param disabled Boolean of whether to set it to disabled or enabled.
     * @param emitEvent Boolean of whether to emit on the valueChange observable.
     */
    public setDisabled(
        control: AbstractFormControl,
        disabled: boolean,
        emitEvent?: boolean
    ): Observable<AbstractFormControl>;
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
                tap(con => console.log(con)),
                tap(con => (con as AbstractControl)[disabled ? 'disable' : 'enable']({
                    emitEvent
                }))
            );
    }

    /**
     * Emits a the form control with new value.
     * @param formName Name of the registered form in Paperweight.
     * @param path `.` separated path to the form control, e.g. `height.feet`
     * @param value The value to set the form control to.
     */
    public setValue<TFormName extends FormNames<RegisteredForms>, T>(
        formName: TFormName,
        path: string | string[],
        value: T
    ): Observable<AbstractFormControl>;
    /**
     * Emits a the form control with new value.
     * @param control A form control set the value of.
     * @param value The value to set the form control to.
     */
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

    /**
     * Emits a form control with reset value.
     * @param formName Name of the registered form in Paperweight.
     * @param path `.` separated path to the form control, e.g. `height.feet`
     * @param value Optional value to reset the form to.
     */
    public reset<TFormName extends FormNames<RegisteredForms>, T = never>(
        formName: TFormName,
        path: string | string[],
        value?: T
    ): Observable<AbstractFormControl>;
        /**
     * Emits a form control with reset value.
     * @param control A form control to reset the value of.
     * @param value Optional value to reset the form to.
     */
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

    /**
     * Emits a boolean for whether the form control is required.
     * @param formName Name of the registered form in Paperweight.
     * @param path `.` separated path to the form control, e.g. `height.feet`
     */
    public isRequired<TFormName extends FormNames<RegisteredForms>>(
        formName: TFormName,
        path: string | string[]
    ): Observable<boolean>;
    /**
     * Emits a boolean for whether the form control is required.
     * @param control The form control to test.
     */
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

    /**
     * Sets (and overwrites) the current validators for a form control.
     * @param formName Name of the registered form in Paperweight.
     * @param path `.` separated path to the form control, e.g. `height.feet`
     * @param validators A ValidatorFn or array of ValidatorFns.
     */
    public setValidators<TFormName extends FormNames<RegisteredForms>>(
        formName: TFormName,
        path: string | string[],
        validators: ValidatorFn | ValidatorFn[]
    ): Observable<AbstractFormControl>;
    /**
     * Sets (and overwrites) the current validators for a form control.
     * @param control The form control to set the validators on.
     * @param validators A ValidatorFn or array of ValidatorFns.
     */
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
        if (typeof args[0] === 'string' && typeof args[1] === 'string')
            return this.getFormControl(args[0] as any, args[1]);
        else if (typeof args[0] === 'string' && this._isControlResolver(args[1]))
            return this._paperweightQuery.getForm(args[0])
                .pipe(
                    map(form => args[1](control(form as FormGroup)).resolve)
                );
        else if (args[0] instanceof Observable)
            return args[0];
        else
            return of(args[0]);
    }

    private _isControlResolver(v: unknown): v is ControlResolver<unknown> {
        return typeof v === 'function';
    }

    /**
     *
     * @param formIdentifier The unique name of the form to register.
     * @param form The form group to register in the service.
     */
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

    /**
     * Unregisters a form group from the Paperweight service and cancels automatic draft saving.
     * @param formIdentifier The name of the form to remove from the service.
     */
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

    /**
     * Returns an array of every form registered in the service.
     */
    public getRegisteredForms(): Observable<AbstractFormGroup[]> {
        return this._paperweightQuery.forms$
            .pipe(
                map(forms => Object.keys(forms).map(key => forms[key]))
            );
    }
}
