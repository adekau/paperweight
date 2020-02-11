import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormDraftService } from 'projects/form-draft/src/public-api';
import { switchMap, tap } from 'rxjs/operators';
import { SubscriptionLike } from 'rxjs';

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
            lastName: ['']
        });

        this._subscriptions.push(
            this._fds.register('form-1', this.form)
                .pipe(
                    switchMap(() => this._fds.getValueChanges('form-1')),
                    switchMap(() => this._fds.getAllDraftsAsync()),
                    tap(v => console.log(v))
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
        this._fds.unregister('form-1');
        this._subscriptions.forEach(sub => sub.unsubscribe());
    }
}
