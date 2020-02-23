import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { IPaperweightState } from 'projects/contracts/src/public-api';

@Injectable({
    providedIn: 'root'
})
@StoreConfig({ name: 'paperweight-store' })
export class PaperweightStore extends Store<IPaperweightState> {
    constructor() {
        super({
            forms: {},
            subscriptions: {}
        });
    }
}
