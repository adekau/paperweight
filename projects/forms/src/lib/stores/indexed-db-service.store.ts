import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { IIndexedDBServiceState } from 'projects/contracts/src/lib/indexed-db-service-state';

@Injectable({
    providedIn: 'root'
})
@StoreConfig({ name: 'indexed-db-service-store' })
export class IndexedDBServiceStore extends Store<IIndexedDBServiceState> {
    constructor() {
        super({
            storeName: 'drafts',
            version: 1
        });
    }
}
