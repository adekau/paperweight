import { Observable } from 'rxjs';

import { AbstractFormControl } from './abstract-form-control';

export interface AbstractFormGroup<C = any> extends AbstractFormControl {
    valueChanges: Observable<any>;
    controls: { -readonly [P in keyof C]: AbstractFormControl | AbstractFormGroup };
}
