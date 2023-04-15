import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from './core/core.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { AviaModule } from './avia/avia.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AviaModule,
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    StoreModule.forRoot({}, {}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
