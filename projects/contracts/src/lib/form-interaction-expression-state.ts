import { Observable } from 'rxjs';

export interface IFormInteractionExpressionState {
    observers: {
        [k: string]: Observable<any>;
    };
}
