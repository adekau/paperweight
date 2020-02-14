import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AbstractFormGroup, IFormDraftState } from 'projects/contracts/src/public-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FormDraftStore } from '../stores/form-draft.store';

@Injectable({
    providedIn: 'root'
})
export class FormDraftQuery extends Query<IFormDraftState> {
    public forms$ = this.select('forms');
    public subscriptions$ = this.select('subscriptions');

    constructor(
        protected store: FormDraftStore
    ) {
        super(store);
    }

    public getForm(formName: string): Observable<AbstractFormGroup> {
        return this.forms$
            .pipe(
                map(forms => forms[formName])
            );
    }

    public hasFormSync(formName: string): boolean {
        return !!this.getValue().forms[formName];
    }

    public hasForm(formName: string): Observable<boolean> {
        return this.forms$
            .pipe(
                map(forms => !!forms[formName])
            );
    }
}
