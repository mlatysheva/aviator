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

import { StoreModule } from '@ngrx/store';
import { searchReducer } from '../store/reducers/search.reducer';
import { PassengersPageComponent } from './pages/passengers-page/passengers-page.component';
import { ReviewPageComponent } from './pages/review-page/review-page.component';
import { BookingReviewComponent } from './components/booking-review/booking-review.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    BookingComponent,
    BookingPageComponent,
    SecondMenuComponent,
    CarouselDateComponent,
    BookingPassengersComponent,
    PassengersPageComponent,
    ReviewPageComponent,
    BookingReviewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    CarouselModule.forRoot(),
    BookingRoutingModule,
    FormsModule,
    StoreModule.forFeature('search', searchReducer),
  ],
})
export class BookingModule {}
