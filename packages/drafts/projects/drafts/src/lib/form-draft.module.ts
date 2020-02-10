import { NgModule } from '@angular/core';

import { FormDraftService } from './form-draft.service';
import { IndexedDBService } from './indexed-db.service';
import { FormDraftQuery } from './queries/form-draft.query';
import { FormDraftStore } from './stores/form-draft.store';

@NgModule({
    providers: [
        FormDraftService,
        IndexedDBService,
        FormDraftStore,
        FormDraftQuery
    ],
    imports: []
})
export class FormDraftModule { }
