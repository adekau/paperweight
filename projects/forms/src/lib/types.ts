export interface PaperweightSchema {
    [k: string]: any;
}

export type FormNames<T extends PaperweightSchema | unknown> = {
    [K in keyof T]: string extends K ? never : number extends K ? never : K
} extends { [_ in keyof T]: infer U } ? ({} extends U ? string : U) : never;

export type GetForm<
    RegisteredForms extends PaperweightSchema | unknown,
    FormName extends FormNames<RegisteredForms>
> = RegisteredForms extends PaperweightSchema ? RegisteredForms[FormName] : never;

export type FormDraft<
    RegisteredForms extends PaperweightSchema | unknown,
    FormName extends FormNames<RegisteredForms>
> = { id: string extends FormName ? string : FormName }
    & ({} extends GetForm<RegisteredForms, FormName>
        ? PaperweightSchema
        : GetForm<RegisteredForms, FormName>);
