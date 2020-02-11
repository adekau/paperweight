import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormDraftModule } from 'projects/form-draft/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
