import { Inject, Injectable, Optional } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';
import { IPaperweightOptions } from 'projects/contracts/src/public-api';
import { from, Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

import { PAPERWEIGHT_OPTIONS } from './paperweight-options';

@Injectable({
    providedIn: 'root'
})
export class IndexedDBService {
    private db$: Observable<IDBPDatabase>;
    private _storeName: string;

    constructor(
        @Optional() @Inject(PAPERWEIGHT_OPTIONS) private _options: IPaperweightOptions
    ) {
        this._storeName = this._options?.storeName || 'drafts';

        this.db$ = from(openDB('form-draft-db', 1, {
            upgrade: (db) => {
                db.createObjectStore(this._storeName, { keyPath: 'id', autoIncrement: true });
            }
        }))
            .pipe(first());
    }

    public get storeName(): string {
        return this._storeName;
    }

    public get(key: IDBValidKey): Observable<any> {
        return this.db$
            .pipe(
                switchMap(db => db.get(this._storeName, key))
            );
    }

    public getAll(): Observable<any> {
        return this.db$
            .pipe(
                switchMap(db => db.getAll(this._storeName))
            );
    }

    public put(obj: any): Observable<IDBValidKey> {
        return this.db$
            .pipe(
                switchMap(db => db.put(this._storeName, obj))
            );
    }

    public delete(id: IDBValidKey): Observable<void> {
        return this.db$
            .pipe(
                switchMap(db => db.delete(this._storeName, id))
            );
    }

    public clearAll(): Observable<void> {
        return this.db$
            .pipe(
                map(db => db
                    .transaction(this._storeName, 'readwrite')
                    .store
                ),
                switchMap(os => os.clear())
            );
    }
}
