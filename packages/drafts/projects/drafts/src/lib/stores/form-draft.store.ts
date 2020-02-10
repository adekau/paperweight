import { EntityStore, StoreConfig } from '@datorama/akita';
import { IFormDraftState } from '@paperweight/contracts';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'form-draft-store' })
export class FormDraftStore extends EntityStore<IFormDraftState> {
    constructor() {
        super();
    }
}
