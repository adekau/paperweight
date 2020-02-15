import { Store, StoreConfig } from '@datorama/akita';
import { IFormInteractionExpressionState } from 'projects/contracts/src/public-api';

@StoreConfig({ name: 'form-interaction-expression-store' })
export class FormInteractionExpressionStore extends Store<IFormInteractionExpressionState> {
    constructor() {
        super({
            observers: { }
        });
    }
}
