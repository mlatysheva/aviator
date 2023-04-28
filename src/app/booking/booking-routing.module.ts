import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingPageComponent } from './pages/booking-page/booking-page.component';
import { PassengersPageComponent } from './pages/passengers-page/passengers-page.component';
import { ReviewPageComponent } from './pages/review-page/review-page.component';

const routes: Routes = [
  { path: '', component: BookingPageComponent },
  { path: 'passengers', component: PassengersPageComponent },
  { path: 'review', component: ReviewPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingRoutingModule {}
