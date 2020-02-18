import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { concatMapTo } from 'rxjs/operators';

import { ConditionExpression } from '../lib/condition-expression';
import { PaperweightService } from '../lib/paperweight.service';
import { ConditionExpressionQuery } from '../lib/queries/condition-expression.query';
import { ConditionExpressionStore } from '../lib/stores/condition-expression.store';

describe('Forms: ConditionExpression', () => {
    let exp: ConditionExpression;
    let form: FormGroup;

    function createExpression() {
        const pws: PaperweightService = TestBed.inject(PaperweightService);
        const builder: FormBuilder = TestBed.inject(FormBuilder);
        const store = new ConditionExpressionStore();
        const query = new ConditionExpressionQuery(store);
        exp = new ConditionExpression(store, query, pws);

        form = builder.group({
            testfield: ['']
        });

        pws.register('testform', form);
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                ReactiveFormsModule
            ],
            providers: [
                PaperweightService
            ]
        }).compileComponents();
    });

    afterEach(() => {
        exp = null;
    });

    it('should get a form component', async(async () => {
        const pws: PaperweightService = TestBed.inject(PaperweightService);
        createExpression();
        exp = exp.from('testform', 'testfield');
        const obs = exp.compile();
        const obs2 = pws.setValue('testform', 'testfield', 5);

        await obs2.pipe(
            concatMapTo(obs)
        ).toPromise();

        expect(form.get('testfield').value).toBe(5);
    }));
});
