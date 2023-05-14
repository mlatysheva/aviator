import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    canActivate: [() => inject(AuthGuard).canActivate()],
    component: CartPageComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartRoutingModule {}
