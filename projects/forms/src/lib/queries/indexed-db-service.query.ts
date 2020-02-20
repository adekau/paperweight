import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { IIndexedDBServiceState } from 'projects/contracts/src/lib/indexed-db-service-state';

import { IndexedDBServiceStore } from '../stores/indexed-db-service.store';

@Injectable({
    providedIn: 'root'
})
export class IndexedDBServiceQuery extends Query<IIndexedDBServiceState> {
    constructor(
        protected store: IndexedDBServiceStore
    ) {
        super(store);
    }

    public getStoreName(): string {
        return this.getValue().storeName;
    }

    public getVersion(): number {
        return this.getValue().version;
    }
}
