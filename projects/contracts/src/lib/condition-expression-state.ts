import { Observable } from 'rxjs';

import { AbstractFormControl } from './abstract-form-control';

export interface IConditionExpressionState {
    source$: Observable<any>;
    control?: Observable<AbstractFormControl | undefined>;
    predicate: (val: any, control?: AbstractFormControl | undefined) => boolean;
    once: boolean;
    key: string;
}
