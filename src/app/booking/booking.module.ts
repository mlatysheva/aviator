import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';
import { BookingPageComponent } from './pages/booking-page/booking-page.component';
import { SecondMenuComponent } from './components/second-menu/second-menu.component';
import { CarouselDateComponent } from './components/carousel-date/carousel-date.component';
import { BookingPassengersComponent } from './components/booking-passengers/booking-passengers.component';

import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { StoreModule } from '@ngrx/store';
import { searchReducer } from '../store/reducers/search.reducer';

@NgModule({
  declarations: [
    BookingComponent,
    BookingPageComponent,
    SecondMenuComponent,
    CarouselDateComponent,
    BookingPassengersComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule.forRoot(),
    BookingRoutingModule,
    BookingRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    FormsModule,
    StoreModule.forFeature('search', searchReducer),
  ],
})
export class BookingModule {}
