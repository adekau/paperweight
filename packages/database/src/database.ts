import { transaction } from '@datorama/akita';
import { IDBStatus } from '@paperweight/enums';
import { IDatabaseRequestOptions } from '@paperweight/contracts';
import { Observable, throwError, of } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';

import { DatabaseQuery } from './queries/database.query';
import { DatabaseRequest } from './request';
import { DatabaseStore } from './stores/database.store';

export class Database {
    private _state: DatabaseStore;
    private _query: DatabaseQuery;

    constructor(name: string, version: number) {
        this._state = new DatabaseStore();
        this._query = new DatabaseQuery(this._state);
        this._updateDBNameVersion(name, version);
    }

    @transaction()
    private _updateStatus(status: IDBStatus): void {
        this._state.update({ status });
        this._state.setLoading(status !== IDBStatus.Connected);
    }

    @transaction()
    private _updateDBNameVersion(name: string, version: number) {
        this._state.update({ name, version });
    }

    private _updateDB(db: IDBDatabase): void {
        this._state.update({ db });
    }

    public connect(opts?: IDatabaseRequestOptions): Observable<void> {
        return this._connect(opts).pipe(
            tap(db => {
                this._updateDB(db);
                this._updateStatus(IDBStatus.Connected)
            }),
            //Don't want to expose the raw db object
            map(() => void 0),
            first()
        );
    }

    public transaction(storeNames: string | string[], mode?: "readonly" | "readwrite" | "versionchange" | undefined): Observable<IDBTransaction> {
        return this._query.db$
            .pipe(
                switchMap(db => {
                    const transaction = db?.transaction(storeNames, mode);
                    if (!transaction)
                        return throwError('Transaction could not be created');
                    return of(transaction);
                })
            );
    }

    private _connect(opts?: IDatabaseRequestOptions): Observable<IDBDatabase> {
        return this._query.nameVersion$.pipe(
            map(nv => new DatabaseRequest(indexedDB.open(nv.name, nv.version), opts)),
            switchMap(dbr => dbr.result() as Promise<IDBDatabase>)
        );
    }
}
