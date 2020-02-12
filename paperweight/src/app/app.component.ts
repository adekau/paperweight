import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormDraftService } from 'projects/form-draft/src/public-api';
import { of, SubscriptionLike } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

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
        private _fds: FormDraftService
    ) {
        this.form = this._formBuilder.group({
            firstName: [''],
            lastName: [''],
            height: this._formBuilder.group({
                feet: [''],
                inches: ['']
            })
        });

        this._subscriptions.push(
            this._fds.register('form-1', this.form)
                .pipe(
                    switchMap(name => this._fds.getValueChanges(name)),
                    switchMap(() => this._fds.getAllDraftsAsync()),
                    tap(v => console.log(v)),
                    switchMap(() => this._fds.getFormControl('form-1', 'height.inches')),
                    switchMap(control => {
                        return this._fds.getFormControl('form-1', 'height.feet').pipe(
                            switchMap(control2 => this._fds.setDisabled(control, control2.value > 10))
                        );
                    }),
                    tap(v => console.log(v.value))
                )
                .subscribe()
        );
    }

    public onSubmit(data: any): void {
        console.warn('Submitted', data);
    }

    public toggle(): void {
        this.show ^= 1;
    }

    public ngOnDestroy(): void {
        this._subscriptions.push(
            this._fds.unregister('form-1').subscribe()
        );
        this._subscriptions.forEach(sub => sub.unsubscribe());
    }
}
