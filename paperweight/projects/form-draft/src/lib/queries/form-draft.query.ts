import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { IFormDraftState } from 'projects/contracts/src/public-api';

import { FormDraftStore } from '../stores/form-draft.store';

@Injectable({
    providedIn: 'root'
})
export class FormDraftQuery extends Query<IFormDraftState> {
    public forms$ = this.select();

    constructor(
        protected store: FormDraftStore
    ) {
        super(store);
    }
}
