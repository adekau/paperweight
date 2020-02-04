import { pipe } from '../airo/src/Monad/Pipeable';
import { ask, bind, map, Reader } from '../airo/src/Monad/Reader';
export class Database {
    constructor(name, version) {
        this._state = {
            name,
            version,
            status: 1 /* Disconnected */
        };
    }
    _updateStatus(status) {
        return pipe(ask(), map(s => ({
            status,
            ...s
        })))(this._state);
    }
    _updateDB(db) {
        return pipe(ask(), map(s => ({
            db,
            ...s
        })))(this._state);
    }
    async connect() {
        return new Promise((res, rej) => {
            const req = this._connect()(this._state);
            const unlisten = () => {
                req.removeEventListener('success', success);
                req.removeEventListener('error', error);
            };
            const success = () => {
                this._state = this._updateDB(req.result);
                this._state = this._updateStatus(0 /* Connected */);
                unlisten();
                res();
            };
            const error = () => {
                this._state = this._updateStatus(2 /* Failed */);
                unlisten();
                rej(req.error);
            };
            req.addEventListener('success', success);
            req.addEventListener('error', error);
        });
    }
    _connect() {
        return pipe(ask(), bind(s => Reader.of(indexedDB.open(s.name, s.version))));
    }
}
//# sourceMappingURL=database.js.map