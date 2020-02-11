import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { IndexedDBService } from './indexed-db.service';
import { FormDraftQuery } from './queries/form-draft.query';
import { FormDraftStore } from './stores/form-draft.store';

@Injectable({
    providedIn: 'root'
})
export class FormDraftService {

    constructor(
        private idbService: IndexedDBService,
        private formDraftStore: FormDraftStore,
        private formDraftQuery: FormDraftQuery
    ) { }

    public saveDraftAsync(draft: any): Observable<IDBValidKey> {
        return this.idbService.put(draft);
    }

    public getDraftAsync(key: IDBValidKey): Observable<any> {
        return this.idbService.get(key);
    }

    public getAllDraftsAsync(): Observable<any> {
        return this.idbService.getAll();
    }

    public register(formIdentifier: string, form: FormGroup): void {
        this.formDraftStore.upsert(formIdentifier, form);
    }

    public getRegisteredForms(): Observable<FormGroup[]> {
        return this.formDraftQuery.forms$;
    }
}
