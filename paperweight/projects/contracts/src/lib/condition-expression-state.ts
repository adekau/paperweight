import { Observable } from 'rxjs';

export interface IConditionExpressionState {
    source$: Observable<any>;
    predicate: (val: any) => boolean;
    once: boolean;
    key: string;
}
