import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';
import { BookingPageComponent } from './pages/booking-page/booking-page.component';
import { SecondMenuComponent } from './components/second-menu/second-menu.component';


@NgModule({
  declarations: [
    BookingComponent,
    BookingPageComponent,
    SecondMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BookingRoutingModule
  ]
})
export class BookingModule { }
