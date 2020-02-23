import { FormGroup } from '@angular/forms';
import { AbstractFormControl, AbstractFormGroup } from 'projects/contracts/src/public-api';

export interface Selector<TObj> {
    <TProp extends keyof TObj>(k: TProp): Selector<TObj[TProp]>;
    value: TObj | undefined;
};

export function safeGet<TObj>(obj: TObj) {
    return function r<TProp extends keyof TObj>(k: TProp): Selector<TObj[TProp]> {
        if (!obj[k])
            return Object.assign(
                safeGet({}),
                { value: undefined }
            );
        return Object.assign(
            safeGet(obj[k]),
            { value: obj[k] }
        );
    }
}

export interface ControlResolver<TForm> {
    <TControl extends keyof TForm>(c: TControl): ControlResolver<TForm[TControl]>;
    resolve: AbstractFormControl | AbstractFormGroup | undefined;
}

export function control<TForm>(form: FormGroup) {
    return function r<TControl extends keyof TForm>(c: TControl): ControlResolver<TForm[TControl]> {
        if (!form.controls[c as string])
            return Object.assign(
                control<TForm[TControl]>({ controls: [] } as any),
                { resolve: undefined }
            );

        if ((form.controls[c as string] as FormGroup).controls)
            return Object.assign(
                control<TForm[TControl]>(form.controls[c as string] as FormGroup),
                { resolve: form.controls[c as string] }
            );

        return Object.assign(
            control<TForm[TControl]>({ controls: [] } as any),
            { resolve: form.controls[c as string] }
        );
    }
}
