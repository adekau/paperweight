import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaperweightService } from 'projects/form-draft/src/public-api';
import { fromEvent, SubscriptionLike } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
    private _subscriptions: SubscriptionLike[] = [];
    public form: FormGroup;
    public show: number = 1;

    constructor(
        private _formBuilder: FormBuilder,
        private _paperweightService: PaperweightService
    ) {
        this.form = this._formBuilder.group({
            firstName: [''],
            lastName: ['', Validators.required],
            height: this._formBuilder.group({
                feet: [''],
                inches: ['']
            })
        });

        this._subscriptions.push(
            this._paperweightService.register('form-1', this.form)
                // .pipe(
                //     switchMap(name => this._fds.getValueChanges(name)),
                //     switchMap(() => this._fds.getAllDraftsAsync()),
                //     tap(v => console.log(v)),
                //     switchMap(() => {
                //         return this._fds.getFormControl('form-1', 'height.feet').pipe(
                //             switchMap(control2 => this._fds.setDisabled('form-1', 'height.inches', control2.value > 10))
                //         );
                //     }),
                //     tap(v => console.log(v.value)),
                //     switchMap(v => this._fds.isRequired(v)),
                //     tap(b => console.log(b)),
                //     switchMap(() => this._fds.setValidators('form-1', 'height.inches', Validators.required)),
                //     switchMap(v => this._fds.isRequired('form-1', 'lastName')),
                //     tap(b => console.log(b))
                // )
                .subscribe()
        );

        const expression = this._paperweightService.createExpression()
            .do(c => c.onEmit(fromEvent(document, 'click')),
                action => [
                    action.setDisabled('form-1', 'height.inches', true),
                    action.setValue('form-1', 'height.feet', 300)
                ])
            .do(c => c.from('form-1', 'firstName').if(v => v === 'Alex'),
                action => action.setValue('form-1', 'lastName', 'Dekau'))
            .do(c => c.from('form-1', 'height.feet').if(v => v > 200).once(),
                action => action.setValue('form-1', 'firstName', 'Bob'))
            .compile();

        this._subscriptions.push(expression.subscribe());
    }

    public onSubmit(data: any): void {
        console.warn('Submitted', data);
    }

    public toggle(): void {
        this.show ^= 1;
    }

    public async ngOnDestroy(): Promise<void> {
        await this._paperweightService.unregister('form-1').toPromise();
        this._subscriptions.forEach(sub => sub.unsubscribe());
    }
}
