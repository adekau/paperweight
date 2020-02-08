export class DatabaseRequest<T extends IDBRequest<unknown>> {
    constructor(private _request: T) { }

    public async result(): Promise<unknown> {
        return new Promise<unknown>((res, rej) => {
            const req = this._request;

            const unlisten = () => {
                req.removeEventListener('success', success);
                req.removeEventListener('error', error);
            };

            const success = () => {
                unlisten();
                res(req.result);
            }

            const error = () => {
                unlisten();
                rej(req.error);
            }

            req.addEventListener('success', success);
            req.addEventListener('error', error);
        });
    }
}
