import { Query } from '@datorama/akita';
import { IConditionExpressionState } from 'projects/contracts/src/lib/condition-expression-state';

import { ConditionExpressionStore } from '../stores/condition-expression.store';

export class ConditionExpressionQuery extends Query<IConditionExpressionState> {
    constructor(
        protected store: ConditionExpressionStore
    ) {
        super(store);
    }
}
