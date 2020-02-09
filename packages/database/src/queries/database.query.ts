import { Query } from '@datorama/akita';
import { IDBState } from '@paperweight/contracts';
import { DatabaseStore } from 'src/stores/database.store';

export class DatabaseQuery extends Query<IDBState> {
    nameVersion$ = this.select(['name', 'version']);
    status$ = this.select('status');
    db$ = this.select('db');

    constructor(protected _store: DatabaseStore) {
        super(_store);
    }
}
