import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IPaperweightOptions } from 'projects/contracts/src/public-api';
import { Subject } from 'rxjs';

import { ConditionExpression } from '../lib/condition-expression';
import { PAPERWEIGHT_OPTIONS } from '../lib/paperweight-options';
import { PaperweightService } from '../lib/paperweight.service';
import { ConditionExpressionQuery } from '../lib/queries/condition-expression.query';
import { ConditionExpressionStore } from '../lib/stores/condition-expression.store';
import { PaperweightSchema } from '../lib/types';

interface TestSchema extends PaperweightSchema {
    'testform': {
        'testfield': any;
    };
}

describe('Forms: ConditionExpression', () => {
    let exp: ConditionExpression<TestSchema>;
    let form: FormGroup;

    function createExpression() {
        const pws: PaperweightService<TestSchema> = TestBed.inject(PaperweightService) as any;
        const store = new ConditionExpressionStore();
        const query = new ConditionExpressionQuery(store);
        exp = new ConditionExpression<TestSchema>(store, query, pws);
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                ReactiveFormsModule
            ],
            providers: [
                PaperweightService,
                {
                    provide: PAPERWEIGHT_OPTIONS,
                    useValue: {
                        debounceInterval: 1
                    } as IPaperweightOptions
                }
            ]
        }).compileComponents();

        const pws: PaperweightService = TestBed.inject(PaperweightService);
        const builder: FormBuilder = TestBed.inject(FormBuilder);

        form = builder.group({
            testfield: ['']
        });

        pws.register('testform', form);
    });

    afterEach(() => {
        exp = null;
        form = null;
    });

    it('should source from a form component', async(() => {
        const pws: PaperweightService<TestSchema> = TestBed.inject(PaperweightService) as any;
        createExpression();

        exp = exp.from('testform', 'testfield');
        const obs$ = exp.compile();
        const obs2$ = pws.setValue('testform', 'testfield', 5);

        obs$.subscribe({
            next: ([val, control]) => {
                expect(val).toBe(5);
                expect(control).toEqual(form.get('testfield'));
            }
        });

        obs2$.subscribe();
    }));

    it('should source from a provided observable', async(() => {
        createExpression();

        const subject: Subject<number[]> = new Subject();
        const newExp = exp.onEmit(subject);
        const obs$ = newExp.compile();

        obs$.subscribe({
            next: ([val, control]) => {
                expect(val).toEqual([1, 2, 3, 4]);
                expect(control).toBeUndefined();
            }
        });

        subject.next(Array.of(1, 2, 3, 4));
        subject.complete();
    }));

    it('should filter based on a predicate', async(() => {
        createExpression();

        const subject: Subject<number[]> = new Subject();
        const newExp = exp
            .onEmit(subject)
            .if(val => val.some(v => v > 500));
        const obs$ = newExp.compile();

        obs$.subscribe({
            next: ([val, control]) => {
                expect(val).toEqual([1, 501, 3, 4]);
                expect(control).toBeUndefined();
            }
        });

        subject.next(Array.of(1, 2, 3, 4));
        subject.next(Array.of(-1, 2, -3112, 4));
        subject.next(Array.of(0, null, -200, 4));
        subject.next(Array.of(1, 501, 3, 4));
        subject.complete();
    }));

    it('should complete after one change with "once"', async(() => {
        const pws: PaperweightService<TestSchema> = TestBed.inject(PaperweightService) as any;
        createExpression();
        const complete = jasmine.createSpy('complete');
        const next = jasmine.createSpy('next');
        exp = exp
            .from('testform', 'testfield')
            .once();
        const obs$ = exp.compile();

        obs$.subscribe({
            next: ([val, control]) => {
                next();
                expect(val).toEqual('hello');
                expect(control).toEqual(form.get('testfield'));
            },
            complete: () => complete()
        });

        pws.setValue('testform', 'testfield', 'hello').subscribe();
        pws.setValue('testform', 'testfield', 'another value').subscribe();
        expect(complete).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledTimes(1);
    }));
});
