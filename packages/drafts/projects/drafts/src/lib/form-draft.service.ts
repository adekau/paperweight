import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { IndexedDBService } from './indexed-db.service';
import { FormDraftQuery } from './queries/form-draft.query';
import { FormDraftStore } from './stores/form-draft.store';

@Injectable({
    providedIn: 'root',
})
export class FormDraftService {
    private _formDraftStore: FormDraftStore;
    private _formDraftQuery: FormDraftQuery;

    constructor(
        private _idbService: IndexedDBService,
    ) {
        this._formDraftStore = new FormDraftStore();
        this._formDraftQuery = new FormDraftQuery(this._formDraftStore);
    }

    public saveDraftAsync(draft: any): Observable<IDBValidKey> {
        return this._idbService.put(draft);
    }

    public getDraftAsync(key: IDBValidKey): Observable<any> {
        return this._idbService.get(key);
    }

    public getAllDraftsAsync(): Observable<any> {
        return this._idbService.getAll();
    }

    public register(formIdentifier: string, form: FormGroup): void {
        this._formDraftStore.upsert(formIdentifier, form);
    }

    public getRegisteredForms(): Observable<FormGroup[]> {
        return this._formDraftQuery.forms$;
    }
}
