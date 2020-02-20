import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IPaperweightOptions } from 'projects/contracts/src/public-api';
import { concatMap, tap } from 'rxjs/operators';

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

        it('should use dbVersion if set', () => {
            opts.dbVersion = 2;
            const idbs = TestBed.inject(IndexedDBService);

            expect(idbs.version).toBe(2);
        });

        it('should default to 1 if dbVersion is not set', () => {
            const idbs = TestBed.inject(IndexedDBService);

            expect(idbs.version).toBe(1);
        });
    });

    it('should save and retrieve an object', (done) => {
        const idbs = TestBed.inject(IndexedDBService);

        idbs.put({ test: 'value' })
            .pipe(
                concatMap(k => idbs.get(k))
            )
            .subscribe({
                next: d => {
                    expect(d).toEqual({ test: 'value', id: jasmine.anything() });
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
                concatMap(k => idbs.delete(k)),
                concatMap(() => idbs.get(key))
            )
            .subscribe({
                next: d => {
                    expect(key).toBeGreaterThan(0);
                    expect(d).toBeUndefined();
                    done();
                }
            });
    });
});
