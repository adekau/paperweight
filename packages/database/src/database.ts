import { transaction } from '@datorama/akita';
import { IDBStatus } from '@paperweight/enums';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

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

    public async connect(): Promise<void> {
        return this._connect().pipe(
            tap(db => {
                this._updateDB(db);
                this._updateStatus(IDBStatus.Connected)
            }),
            // Don't want to expose the raw db object
            map(() => void 0)
        ).toPromise();
    }

    private _connect(): Observable<IDBDatabase> {
        return this._query.nameVersion$.pipe(
            map(nv => new DatabaseRequest(indexedDB.open(nv.name, nv.version))),
            switchMap(dbr => dbr.result)
        );
    }
}
