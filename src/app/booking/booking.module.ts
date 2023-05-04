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

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { searchReducer } from '../store/reducers/search.reducer';
import { PassengersPageComponent } from './pages/passengers-page/passengers-page.component';
import { ReviewPageComponent } from './pages/review-page/review-page.component';
import { BookingReviewComponent } from './components/booking-review/booking-review.component';
import { DisallowChoiceDateDirective } from './directives/disallow-choice-date.directive';
import { SharedModule } from '../shared/shared.module';
import { passengersReducer } from '../store/reducers/passengers.reducer';

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
    DisallowChoiceDateDirective,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    CarouselModule.forRoot(),
    BookingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('search', searchReducer),
    StoreModule.forFeature('passengersInfo', passengersReducer),
  ],
})
export class BookingModule {}
