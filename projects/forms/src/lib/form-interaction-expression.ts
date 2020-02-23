import { merge, Observable, of } from 'rxjs';
import { ignoreElements, mergeMapTo } from 'rxjs/operators';

import { ConditionExpression } from './condition-expression';
import { PaperweightService } from './paperweight.service';
import { ConditionExpressionQuery } from './queries/condition-expression.query';
import { FormInteractionExpressionQuery } from './queries/form-interaction-expression.query';
import { ConditionExpressionStore } from './stores/condition-expression.store';
import { FormInteractionExpressionStore } from './stores/form-interaction-expression.store';
import { PaperweightSchema } from './types';

export class FormInteractionExpression<RegisteredForms extends PaperweightSchema> {
    private _store: FormInteractionExpressionStore;
    private _query: FormInteractionExpressionQuery;

    constructor(
        private _paperweightService: PaperweightService<RegisteredForms>
    ) {
        this._store = new FormInteractionExpressionStore();
        this._query = new FormInteractionExpressionQuery(this._store);
    }

    public do(
        condition: (condition: ConditionExpression<RegisteredForms, never>) => ConditionExpression<RegisteredForms, unknown>,
        action: (pws: PaperweightService<RegisteredForms>) => Observable<any> | Observable<any>[]
    ): this {
        const store = new ConditionExpressionStore();
        const query = new ConditionExpressionQuery(store);
        const cond = condition(new ConditionExpression<RegisteredForms>(store, query, this._paperweightService));
        const actions = action(this._paperweightService);
        const key = cond.getKey();
        const obs$ = cond.compile();
        const existing$ = this._query.getObserversSync()[key] || of();

        const final$ = obs$
            .pipe(
                // Not using iif() here from rxjs because type guarding is needed.
                mergeMapTo(Array.isArray(actions)
                    ? merge(...actions)
                    : actions),
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

    public compile(): Observable<never> {
        const observers = this._query.getObserversSync();
        return merge(...Object.values(observers))
            .pipe(
                ignoreElements()
            );
    }
}
