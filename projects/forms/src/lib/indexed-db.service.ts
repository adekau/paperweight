import { Inject, Injectable, Optional } from '@angular/core';
import { deleteDB, IDBPDatabase, openDB } from 'idb';
import { IPaperweightOptions } from 'projects/contracts/src/public-api';
import { from, Observable } from 'rxjs';
import { map, switchMap, first } from 'rxjs/operators';

import { PAPERWEIGHT_OPTIONS } from './paperweight-options';
import { IndexedDBServiceQuery } from './queries/indexed-db-service.query';
import { IndexedDBServiceStore } from './stores/indexed-db-service.store';

const dbName = 'paperweight-db';

@Injectable({
    providedIn: 'root'
})
export class IndexedDBService {
    private db$: Observable<IDBPDatabase>;

    constructor(
        private _store: IndexedDBServiceStore,
        private _query: IndexedDBServiceQuery,
        @Optional() @Inject(PAPERWEIGHT_OPTIONS) private _options: IPaperweightOptions
    ) {
        if (this._options?.storeName)
            this._store.update({ storeName: this._options.storeName });

        if (this._options?.dbVersion)
            this._store.update({ version: this._options.dbVersion });

        this.db$ = from(openDB(dbName, this.version, {
            upgrade: (db) => {
                db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
            }
        }));
    }

    public get storeName(): string {
        return this._query.getStoreName();
    }

    public get version(): number {
        return this._query.getVersion();
    }

    public get(key: IDBValidKey): Observable<any> {
        return this.db$
            .pipe(
                switchMap(db => db.get(this.storeName, key))
            );
    }

    public getAll(): Observable<any> {
        return this.db$
            .pipe(
                switchMap(db => db.getAll(this.storeName))
            );
    }

    public put(obj: any): Observable<IDBValidKey> {
        return this.db$
            .pipe(
                switchMap(db => db.put(this.storeName, obj))
            );
    }

    public delete(id: IDBValidKey): Observable<void> {
        return this.db$
            .pipe(
                switchMap(db => db.delete(this.storeName, id))
            );
    }

    public clearAll(): Observable<void> {
        return this.db$
            .pipe(
                map(db => db
                    .transaction(this.storeName, 'readwrite')
                    .store
                ),
                switchMap(os => os.clear())
            );
    }

    public closeDb(): Observable<void> {
        return this.db$
            .pipe(
                map(db => db.close())
            );
    }

    public deleteDb(): Observable<void> {
        return from(deleteDB(dbName, {
            blocked: () => {
                throw new Error('Unable to delete db.');
            }
        }));
    }
}
