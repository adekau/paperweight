import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormDraftModule } from '../../../packages/draft/lib/form-draft.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormDraftModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
