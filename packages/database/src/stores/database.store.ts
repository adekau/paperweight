import { Store, StoreConfig } from '@datorama/akita';
import { IDBState } from '@paperweight/contracts';
import { IDBStatus } from '@paperweight/enums';

export function createInitialState(): IDBState {
    return {
        name: '',
        version: 0,
        status: IDBStatus.Disconnected
    };
}

@StoreConfig({ name: 'database' })
export class DatabaseStore extends Store<IDBState> {
    constructor() {
        super(createInitialState());
    }
}
