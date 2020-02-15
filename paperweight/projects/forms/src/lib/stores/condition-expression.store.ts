import { Store, StoreConfig } from '@datorama/akita';
import { IConditionExpressionState } from 'projects/contracts/src/lib/condition-expression-state';
import { EMPTY } from 'rxjs';

@StoreConfig({ name: 'condition-expression-store' })
export class ConditionExpressionStore extends Store<IConditionExpressionState> {
    public static _keyCount: number = 0;

    constructor() {
        super({
            source$: EMPTY,
            predicate: _ => true,
            once: false,
            key: (++ConditionExpressionStore._keyCount).toString()
        });
    }
}
