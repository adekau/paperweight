import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IPaperweightOptions } from 'projects/contracts/src/public-api';

import { IndexedDBService } from '../lib/indexed-db.service';
import { PAPERWEIGHT_OPTIONS } from '../lib/paperweight-options';

describe('Forms: IndexedDBService', () => {
    let opts: IPaperweightOptions;

    function optFactory(): IPaperweightOptions {
        return opts;
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                IndexedDBService,
                {
                    provide: PAPERWEIGHT_OPTIONS,
                    useFactory: optFactory
                }
            ]
        }).compileComponents();

        opts = {
            storeName: 'testStore',
            debounceInterval: 1
        };
    });

    describe('Options', () => {
        it('should use storeName if set', () => {
            const idbs = TestBed.inject(IndexedDBService);

            expect(idbs.storeName).toEqual('testStore');
        });

        it('should default to drafts if storeName is not set', () => {
            opts.storeName = undefined;
            const idbs = TestBed.inject(IndexedDBService);

            expect(idbs.storeName).toEqual('drafts');
        });
    });
});
