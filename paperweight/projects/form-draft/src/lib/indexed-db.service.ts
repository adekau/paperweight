import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';
import { from, Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class IndexedDBService {
    private db$: Observable<IDBPDatabase>;
    private storeName = 'drafts';

    constructor() {
        this.db$ = from(openDB('form-draft-db', 1, {
            upgrade: (db) => {
                db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
            }
        }))
            .pipe(first());
    }

    public get(key: IDBValidKey): Observable<any> {
        return this.db$.pipe(
            switchMap(db => db.get(this.storeName, key))
        );
    }

    public getAll(): Observable<any> {
        return this.db$.pipe(
            switchMap(db => db.getAll(this.storeName))
        );
    }

    public put(obj: any): Observable<IDBValidKey> {
        return this.db$.pipe(
            switchMap(db => db.put(this.storeName, obj))
        );
    }
}
