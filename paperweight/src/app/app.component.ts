import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormDraftService } from 'projects/form-draft/src/public-api';
import { interval } from 'rxjs';
import { debounce, switchMap, tap } from 'rxjs/operators';

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
            firstName: [''],
            lastName: ['']
        });

        this._fds.register('form-1', this.form);
        this._fds.getValueChanges('form-1')
            .pipe(
                switchMap(() => this._fds.getAllDraftsAsync()),
                tap(v => console.log(v))
            )
            .subscribe();
    }

    public onSubmit(data): void {
        console.warn('Submitted', data);
    }
}
