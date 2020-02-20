import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { IPaperweightOptions } from 'projects/contracts/src/public-api';
import { PAPERWEIGHT_OPTIONS } from 'projects/forms/src/lib/paperweight-options';
import { FormDraftModule } from 'projects/forms/src/public-api';

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
        provide: PAPERWEIGHT_OPTIONS,
        useValue: {
            debounceInterval: 1500
        } as IPaperweightOptions
    }],
    bootstrap: [AppComponent]
})
export class AppModule { }
