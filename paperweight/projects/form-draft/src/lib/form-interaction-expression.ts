import { ValidatorFn } from '@angular/forms';
import { merge, Observable, of, Subject } from 'rxjs';
import { flatMap, takeWhile } from 'rxjs/operators';

import { FormDraftService } from './form-draft.service';
import { FormInteractionExpressionQuery } from './queries/form-interaction-expression.query';
import { FormInteractionExpressionStore } from './stores/form-interaction-expression.store';

export type ActionFn = () => Observable<any>;

interface ActionFns {
    setDisabled: (
        formName: string,
        path: string | string[],
        disabled: boolean
    ) => ActionFn;

    setValue: <T>(
        formName: string,
        path: string | string[],
        value: T
    ) => ActionFn;

    setValidators: (
        formName: string,
        path: string | string[],
        validators: ValidatorFn | ValidatorFn[]
    ) => ActionFn;
}

export class FormInteractionExpression {
    private static _eventKeyCount: number = 0;
    private _store: FormInteractionExpressionStore;
    private _query: FormInteractionExpressionQuery;

    constructor(
        private _formDraftService: FormDraftService
    ) {
        this._store = new FormInteractionExpressionStore();
        this._query = new FormInteractionExpressionQuery(this._store);
    }

    public when(
        formName: string,
        path: string | string[],
        predicate: (value: any) => boolean,
        action: (action: ActionFns) => ActionFn | ActionFn[]
    ): this {
        const key = this._transformKey(formName, path);
        const controlVc$ = this._query.getObserversSync()[key]
            || this._formDraftService.getControlValueChanges(formName, path);

        const actions = action(this._actionFns());

        const obs$ = controlVc$.pipe(
            flatMap(v => predicate(v)
                ? Array.isArray(actions)
                    ? merge(...(actions.map(ac => ac())))
                    : actions()
                : of(v))
        );

        this._updateStore(key, obs$);

        return this;
    }

    public once(
        formName: string,
        path: string | string[],
        predicate: (value: any) => boolean,
        action: (action: ActionFns) => ActionFn | ActionFn[]
    ): this {
        const key = this._transformKey(formName, path);
        const controlVc$ = this._query.getObserversSync()[key]
            || this._formDraftService.getControlValueChanges(formName, path);

        const actions = action(this._actionFns());

        const obs$ = controlVc$.pipe(
            takeWhile(v => !predicate(v), true),
            flatMap(v => predicate(v)
                ? Array.isArray(actions)
                    ? merge(...(actions.map(ac => ac())))
                    : actions()
                : of(v))
        );

        this._updateStore(key, obs$);

        return this;
    }

    public onEmit<T>(
        event: Observable<T>,
        action: (action: ActionFns) => ActionFn | ActionFn[]
    ): this {
        const actions = action(this._actionFns());
        const obs$ = event.pipe(
            flatMap(() => Array.isArray(actions)
                ? merge(...(actions.map(ac => ac())))
                : actions())
        );

        this._updateStore((++FormInteractionExpression._eventKeyCount).toString(), obs$);

        return this;
    }

    private _updateStore(key: string, val: Observable<any>): void {
        this._store.update(state => ({
            observers: {
                ...(state.observers || {}),
                [key]: val
            }
        }));
    }

    public compile(): Observable<any> {
        const observers = this._query.getObserversSync();
        return merge(...Object.values(observers));
    }

    private _actionFns(): ActionFns {
        return {
            setDisabled: (
                formName: string,
                path: string | string[],
                disabled: boolean
            ) => () => {
                const control = this._formDraftService.getFormControl(formName, path);

                return control
                    .pipe(
                        flatMap(c => this._formDraftService.setDisabled(c, disabled))
                    );
            },

            setValue: <T>(
                formName: string,
                path: string | string[],
                value: T
            ) => () => {
                const control = this._formDraftService.getFormControl(formName, path);

                return control
                    .pipe(
                        flatMap(c => this._formDraftService.setValue(c, value))
                    );
            },

            setValidators: (
                formName: string,
                path: string | string[],
                validators: ValidatorFn | ValidatorFn[]
            ) => () => {
                const control = this._formDraftService.getFormControl(formName, path);

                return control
                    .pipe(
                        flatMap(c => this._formDraftService.setValidators(c, validators))
                    );
            }
        };
    }

    private _transformKey(formName: string, path: string | string[]) {
        const p = Array.isArray(path) ? path.join('.') : path;
        return `${formName}:${p}`;
    }
}
