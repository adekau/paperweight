import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { interval } from 'rxjs';
import { debounce, switchMap, tap } from 'rxjs/operators';
import { FormDraftService } from 'projects/drafts/src/public-api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public form: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _fds: FormDraftService
    ) {
        this.form = this._formBuilder.group({
            firstName: '',
            lastName: ''
        });

        this.form.valueChanges.pipe(
            debounce(() => interval(3000)),
            switchMap(v => this._fds.saveDraftAsync(v)),
            // switchMap(key => this._fds.getDraftAsync(key))
            switchMap(() => this._fds.getAllDraftsAsync()),
            tap(all => console.log(all))
        ).subscribe();

        this._fds.register('form-1', this.form);
    }

    public onSubmit(data): void {
        console.warn('Submitted', data);
    }
}
