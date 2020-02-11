import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { IFormDraftState } from 'projects/contracts/src/public-api';

import { FormDraftStore } from '../stores/form-draft.store';

@Injectable({
    providedIn: 'root'
})
export class FormDraftQuery extends QueryEntity<IFormDraftState> {
    public forms$ = this.selectAll();

    constructor(
        protected store: FormDraftStore
    ) {
        super(store);
    }
}
