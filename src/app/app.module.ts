import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AviaModule } from './avia/avia.module';
import { UserModule } from './user/user.module';
import { BookingModule } from './booking/booking.module';
import { UserEffects } from './store/effects/user.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AviaModule,
    UserModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    BookingModule,
    AppRoutingModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([UserEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 15,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
