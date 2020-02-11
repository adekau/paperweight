import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { IFormDraftOptions } from 'projects/contracts/src/public-api';
import { FORM_DRAFT_OPTIONS, FormDraftModule } from 'projects/form-draft/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormDraftModule
    ],
    providers: [{
        provide: FORM_DRAFT_OPTIONS,
        useValue: {
            debounceInterval: 1500
        } as IFormDraftOptions
    }],
    bootstrap: [AppComponent]
})
export class AppModule { }
