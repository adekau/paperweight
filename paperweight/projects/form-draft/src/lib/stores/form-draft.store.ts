import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { IFormDraftState } from 'projects/contracts/src/public-api';

@Injectable({
    providedIn: 'root'
})
@StoreConfig({ name: 'form-draft-store' })
export class FormDraftStore extends EntityStore<IFormDraftState> {
    constructor() {
        super();
    }
}
