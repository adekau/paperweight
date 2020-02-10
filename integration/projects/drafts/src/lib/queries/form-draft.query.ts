import { QueryEntity } from '@datorama/akita';
import { IFormDraftState } from '@paperweight/contracts';

import { FormDraftStore } from '../stores/form-draft.store';
import { Injectable } from '@angular/core';

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
