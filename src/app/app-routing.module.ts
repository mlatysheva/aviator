import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './core/pages/not-found-page/not-found-page.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AccountPageComponent } from './cart/pages/account-page/account-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: 'main',
    loadChildren: () => import('./avia/avia.module').then((m) => m.AviaModule),
  },
  {
    path: 'flights',
    loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then((m) => m.CartModule),
  },
  { 
    path: 'account', 
    canActivate: [() => inject(AuthGuard).canActivate()],
    component: AccountPageComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
