import { Query } from '@datorama/akita';
import { IFormInteractionExpressionState } from 'projects/contracts/src/public-api';

import { FormInteractionExpressionStore } from '../stores/form-interaction-expression.store';

export class FormInteractionExpressionQuery extends Query<IFormInteractionExpressionState> {
    constructor(protected store: FormInteractionExpressionStore) {
        super(store);
    }

    public getObserversSync(): IFormInteractionExpressionState['observers'] {
        return this.getValue().observers;
    }
}
