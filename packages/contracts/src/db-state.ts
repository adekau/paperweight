import { IDBStatus } from '@paperweight/enums';

export interface IDBState {
    db?: IDBDatabase;
    status: IDBStatus;
    name: string;
    version: number;
};
