import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingPageComponent } from './pages/booking-page/booking-page.component';
import { PassengersPageComponent } from './pages/passengers-page/passengers-page.component';
import { SummaryPageComponent } from './pages/summary-page/summary-page.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    component: BookingPageComponent 
  },
  { 
    path: 'passengers', 
    canActivate: [() => inject(AuthGuard).canActivate()],
    component: PassengersPageComponent 
  },
  { 
    path: 'summary', 
    canActivate: [() => inject(AuthGuard).canActivate()],
    component: SummaryPageComponent 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingRoutingModule {}
