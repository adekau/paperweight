import { IDatabaseRequestOptions } from '@paperweight/contracts';

export class DatabaseRequest<T extends IDBRequest<unknown>> {
    constructor(
        private _request: T,
        private _opts?: IDatabaseRequestOptions
    ) { }

    public async result(): Promise<unknown> {
        return new Promise<unknown>((res, rej) => {
            const req = this._request;

            const unlisten = () => {
                if (this._opts?.upgrade)
                    req.removeEventListener('upgradeneeded', (e) => upgradeneeded(e));
                req.removeEventListener('success', success);
                req.removeEventListener('error', error);
            };

            const upgradeneeded = (event: any) => {
                if(this._opts?.upgrade)
                    this._opts.upgrade(req.result as IDBDatabase, event.oldVersion, event.newVersion, req.transaction!);
            }

            const success = () => {
                unlisten();
                res(req.result);
            }

            const error = () => {
                unlisten();
                rej(req.error);
            }

            if (this._opts?.upgrade)
                req.addEventListener('upgradeneeded', upgradeneeded);
            req.addEventListener('success', success);
            req.addEventListener('error', error);
        });
    }
}
