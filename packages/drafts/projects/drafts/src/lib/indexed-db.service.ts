import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';
import { from, Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class IndexedDBService {
    private _db$: Observable<IDBPDatabase>;
    private _storeName: string = 'drafts';

    constructor() {
        this._db$ = from(openDB('form-draft-db', 1, {
            upgrade: (db) => {
                db.createObjectStore(this._storeName, { keyPath: 'id', autoIncrement: true });
            }
        }))
            .pipe(first());
    }

    public get(key: IDBValidKey): Observable<any> {
        return this._db$.pipe(
            switchMap(db => db.get(this._storeName, key))
        );
    }

    public getAll(): Observable<any> {
        return this._db$.pipe(
            switchMap(db => db.getAll(this._storeName))
        );
    }

    public put(obj: any): Observable<IDBValidKey> {
        return this._db$.pipe(
            switchMap(db => db.put(this._storeName, obj))
        );
    }
}
