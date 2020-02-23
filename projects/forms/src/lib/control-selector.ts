import { AbstractFormGroup, AbstractFormControl } from 'projects/contracts/src/public-api';

interface Test {
    'test-1': {
        'test-1.1': {
            'test-1.1.1': string;
        },
        'test-1.2': {
            'test-1.2.1': number;
        }
    },
    'test-2': boolean;
}

type Primitive = string | number | boolean;

type Continue<TSchema, Key extends keyof TSchema> = TSchema[Key] extends Primitive
    ? AbstractFormControl
    : <TName extends keyof TSchema[Key]>(name: TName) => Continue<TSchema[Key], TName>;

export const registeredForms = <TSchema>(controls: AbstractFormGroup['controls']) => {
    return function recur<TName extends keyof TSchema>(name: TName): Continue<TSchema, TName> {
        if (Object.prototype.hasOwnProperty.call(controls[name], 'controls'))
            return registeredForms<TSchema[TName]>(controls[name]['controls']) as Continue<TSchema, TName>;
        else
            return controls[name] as AbstractFormControl as Continue<TSchema, TName>;;
    }
}


