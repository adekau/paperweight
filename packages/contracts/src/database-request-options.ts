export interface IDatabaseRequestOptions {
    upgrade?: (db: IDBDatabase, oldVersion: number, newVersion: number, transaction: IDBTransaction) => void;
}
