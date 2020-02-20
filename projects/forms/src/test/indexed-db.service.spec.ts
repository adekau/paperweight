import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IPaperweightOptions } from 'projects/contracts/src/public-api';
import { switchMap, tap } from 'rxjs/operators';

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
            debounceInterval: 1
        };
    });

    describe('Options', () => {
        it('should use storeName if set', () => {
            opts.storeName = 'testStore';
            const idbs = TestBed.inject(IndexedDBService);

            expect(idbs.storeName).toEqual('testStore');
        });

        it('should default to drafts if storeName is not set', () => {
            const idbs = TestBed.inject(IndexedDBService);

            expect(idbs.storeName).toEqual('drafts');
        });
    });

    it('should save and retrieve an object', (done) => {
        const idbs = TestBed.inject(IndexedDBService);

        idbs.put({ test: 'value' })
            .pipe(
                switchMap(key => idbs.get(key))
            )
            .subscribe({
                next: draft => {
                    expect(draft).toEqual({ test: 'value', id: jasmine.anything() });
                    done();
                }
            });
    });

    it('should delete an object', (done) => {
        const idbs = TestBed.inject(IndexedDBService);
        let key: IDBValidKey;

        idbs.put({ test: 'value' })
            .pipe(
                tap(k => key = k),
                switchMap(k => idbs.delete(k)),
                switchMap(() => idbs.get(key))
            )
            .subscribe({
                next: d => {
                    expect(key).toBeDefined();
                    expect(d).toBeUndefined();
                    done();
                }
            });
    });
});
