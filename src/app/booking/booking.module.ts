import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';
import { BookingPageComponent } from './pages/booking-page/booking-page.component';
import { SecondMenuComponent } from './components/second-menu/second-menu.component';
import { BookingPassengersComponent } from './components/booking-passengers/booking-passengers.component';
import { MatCardModule } from '@angular/material/card';
import { StoreModule } from '@ngrx/store';
import { searchReducer } from '../store/reducers/search.reducer';

@NgModule({
  declarations: [
    BookingComponent,
    BookingPageComponent,
    SecondMenuComponent,
    BookingPassengersComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    BookingRoutingModule,
    MatCardModule,
    StoreModule.forFeature('search', searchReducer),
  ],
})
export class BookingModule {}
