import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { control } from 'projects/forms/src/lib/control-selector';
import { PaperweightService } from 'projects/forms/src/public-api';
import { fromEvent, SubscriptionLike } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

interface Form1 {
    firstName: string;
    lastName: string;
    height: {
        feet: number;
        inches: number;
    };
}

interface Form2 {
    address: string;
    phone: string;
    payment: {
        dollars: number;
        cents: number;
    };
}

interface MySchema {
    'form-1': Form1;
    'form-2': Form2;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
    private _subscriptions: SubscriptionLike[] = [];
    public form: FormGroup;
    public form2: FormGroup;
    public show: number = 1;

    constructor(
        private _formBuilder: FormBuilder,
        private _paperweightService: PaperweightService<MySchema>
    ) {
        this.form = this._formBuilder.group({
            firstName: [''],
            lastName: ['', Validators.required],
            height: this._formBuilder.group({
                feet: [''],
                inches: ['']
            })
        });

        this.form2 = this._formBuilder.group({
            address: [''],
            phone: ['', Validators.required],
            payment: this._formBuilder.group({
                dollars: [''],
                cents: ['']
            })
        });

        this._subscriptions.push(
            this._paperweightService.register('form-1', this.form)
                .pipe(
                    switchMap(() => this._paperweightService.getValueChanges('form-1')),
                    switchMap(() => this._paperweightService.setDisabled('form-2', c => c('address'), true)),
                    switchMap(() => this._paperweightService.getDraftAsync('form-1')),
                    tap(v => console.log(v))
                )
                .subscribe(),
            this._paperweightService.register('form-2', this.form2)
                .pipe(
                    switchMap(() => this._paperweightService.getValueChanges('form-2')),
                    switchMap(() => this._paperweightService.getAllDraftsAsync()),
                    tap(v => console.log(v.find(v2 => v2.id === 'form-2')))
                )
                .subscribe(),
            this._paperweightService.setDisabled('form-2', r => r('payment')('cents'), true).subscribe()
        );

        const expression = this._paperweightService.createExpression()
            .do(c => c.onEmit(fromEvent(document, 'click')),
                action => [
                    action.setValue('form-1', 'height.feet', 300)
                ])
            .do(c => c.from('form-1', 'firstName').if(v => v === 'Alex'),
                action => action.setValue('form-1', 'lastName', 'Dekau'))
            .do(c => c.if(v => v > 200).from('form-1', 'height.feet').once(),
                action => action.setValue('form-1', 'firstName', 'Bob'));

        const expression2 = this._paperweightService.createExpression()
            .do(c => c.from('form-1', 'lastName').if(v => v > 200),
                action => action.setDisabled('form-2', 'payment.dollars', true))
            .do(c => c.from('form-1', 'lastName').if(v => v <= 200),
                action => action.setDisabled('form-2', 'payment.dollars', false))
            .do(c => c.onEmit(fromEvent(document, 'click')).if(ev => ev.isTrusted),
                action => action.setValue('form-2', 'payment.cents', 400))
            .do(c => c.from('form-2', 'phone').if((_, control) => control.valid),
                ac => ac.reset('form-2', 'payment.dollars'))

        this._subscriptions.push(
            expression.compile().subscribe(),
            expression2.compile().subscribe()
        );

        console.log(control<MySchema['form-1']>(this.form)('height')('feet').resolve);
    }

    public onSubmit(data: any): void {
        console.warn('Submitted', data);
    }

    public toggle(): void {
        this.show ^= 1;
    }

    public load(formName: 'form-1' | 'form-2') {
        this._subscriptions.push(
            this._paperweightService.loadDraft(formName).subscribe()
        )
    }

    public async ngOnDestroy(): Promise<void> {
        await this._paperweightService.unregister('form-1').toPromise();
        this._subscriptions.forEach(sub => sub.unsubscribe());
    }
}
