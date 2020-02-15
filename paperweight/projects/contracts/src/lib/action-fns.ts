import { ValidatorFn } from '@angular/forms';

import { ActionFn } from './action-fn';

export interface ActionFns {
    setDisabled: (
        formName: string,
        path: string | string[],
        disabled: boolean
    ) => ActionFn;

    setValue: <T>(
        formName: string,
        path: string | string[],
        value: T
    ) => ActionFn;

    setValidators: (
        formName: string,
        path: string | string[],
        validators: ValidatorFn | ValidatorFn[]
    ) => ActionFn;
}
