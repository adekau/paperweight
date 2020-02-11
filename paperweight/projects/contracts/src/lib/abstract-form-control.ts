import { AbstractControl } from '@angular/forms';

export type AbstractFormControl = Pick<
  AbstractControl,
  | 'value'
  | 'valid'
  | 'invalid'
  | 'disabled'
  | 'errors'
  | 'touched'
  | 'pristine'
  | 'pending'
  | 'dirty'
>;
