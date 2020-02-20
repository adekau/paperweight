import { ValidatorFn } from '@angular/forms';
import { ActionFn, ActionFns } from 'projects/contracts/src/public-api';
import { merge, Observable, of } from 'rxjs';
import { flatMap, ignoreElements, mergeMapTo } from 'rxjs/operators';

import { ConditionExpression } from './condition-expression';
import { PaperweightService } from './paperweight.service';
import { ConditionExpressionQuery } from './queries/condition-expression.query';
import { FormInteractionExpressionQuery } from './queries/form-interaction-expression.query';
import { ConditionExpressionStore } from './stores/condition-expression.store';
import { FormInteractionExpressionStore } from './stores/form-interaction-expression.store';

export class FormInteractionExpression {
    private _store: FormInteractionExpressionStore;
    private _query: FormInteractionExpressionQuery;

    constructor(
        private _paperweightService: PaperweightService
    ) {
        this._store = new FormInteractionExpressionStore();
        this._query = new FormInteractionExpressionQuery(this._store);
    }

    public do(
        condition: (condition: ConditionExpression) => ConditionExpression,
        action: (action: ActionFns) => ActionFn | ActionFn[]
    ): this {
        const store = new ConditionExpressionStore();
        const query = new ConditionExpressionQuery(store);
        const cond = condition(new ConditionExpression(store, query, this._paperweightService));
        const actions = action(this._actionFns());
        const key = cond.getKey();
        const obs$ = cond.compile();
        const existing$ = this._query.getObserversSync()[key] || of();

        const final$ = obs$
            .pipe(
                // Not using iif() here from rxjs because type guarding is needed.
                mergeMapTo(Array.isArray(actions)
                    ? merge(...(actions.map(ac => ac())))
                    : actions()),
                mergeMapTo(existing$)
            );

        this._updateStore(key, final$);

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
        return merge(...Object.values(observers))
            .pipe(
                ignoreElements()
            );
    }

    private _actionFns(): ActionFns {
        return {
            setDisabled: (
                formName: string,
                path: string | string[],
                disabled: boolean
            ) => () => {
                const control = this._paperweightService.getFormControl(formName, path);

                return control
                    .pipe(
                        flatMap(c => this._paperweightService.setDisabled(c, disabled))
                    );
            },

            setValue: <T>(
                formName: string,
                path: string | string[],
                value: T
            ) => () => {
                const control = this._paperweightService.getFormControl(formName, path);

                return control
                    .pipe(
                        flatMap(c => this._paperweightService.setValue(c, value))
                    );
            },

            reset: <T = never>(
                formName: string,
                path: string | string[],
                value?: T
            ) => () => {
                const control = this._paperweightService.getFormControl(formName, path);

                return control
                    .pipe(
                        flatMap(c => this._paperweightService.reset(c, value))
                    );
            },

            setValidators: (
                formName: string,
                path: string | string[],
                validators: ValidatorFn | ValidatorFn[]
            ) => () => {
                const control = this._paperweightService.getFormControl(formName, path);

                return control
                    .pipe(
                        flatMap(c => this._paperweightService.setValidators(c, validators))
                    );
            }
        };
    }
}