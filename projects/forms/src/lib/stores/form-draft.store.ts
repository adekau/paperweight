import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { IFormDraftState } from 'projects/contracts/src/public-api';

@Injectable({
    providedIn: 'root'
})
@StoreConfig({ name: 'form-draft-store' })
export class FormDraftStore extends Store<IFormDraftState> {
    constructor() {
        super({
            forms: {},
            subscriptions: {}
        });
    }
}
