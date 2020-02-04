import { ask, pipe, Reader, ReaderP } from '@paperweight/airo';
import { IDBState } from '@paperweight/contracts';
import { IDBStatus } from '@paperweight/enums';

export class Database {
    private _state: IDBState;

    constructor(name: string, version: number) {
        this._state = {
            name,
            version,
            status: IDBStatus.Disconnected
        };
    }

    private _updateStatus(status: IDBStatus): Reader<IDBState, IDBState> {
        return pipe(
            ask<IDBState>(),
            ReaderP.map(s => (<IDBState>{
                status,
                ...s
            }))
        );
    }

    private _updateDB(db: IDBDatabase): Reader<IDBState, IDBState> {
        return pipe(
            ask<IDBState>(),
            ReaderP.map(s => (<IDBState>{
                db,
                ...s
            }))
        );
    }

    public async connect(): Promise<void> {
        return new Promise<void>((res, rej) => {
            const req = pipe(this._state, this._connect());

            const unlisten = () => {
                req.removeEventListener('success', success);
                req.removeEventListener('error', error);
            };

            const success = () => {
                this._state = pipe(
                    this._state,
                    this._updateDB(req.result),
                    this._updateStatus(IDBStatus.Connected)
                );
                unlisten();
                res();
            }

            const error = () => {
                this._state = pipe(this._state, this._updateStatus(IDBStatus.Failed));
                unlisten();
                rej(req.error);
            }

            req.addEventListener('success', success);
            req.addEventListener('error', error);
        });
    }

    private _connect(): Reader<IDBState, IDBOpenDBRequest> {
        return pipe(
            ask<IDBState>(),
            ReaderP.bind(s => Reader.of(indexedDB.open(s.name, s.version)))
        );
    }
}
