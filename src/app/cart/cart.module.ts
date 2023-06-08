import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartRoutingModule } from './cart-routing.module';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AccountPageComponent } from './pages/account-page/account-page.component';


@NgModule({
  declarations: [
    CartPageComponent,
    AccountPageComponent
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    AgGridModule,
    SharedModule,
    FormsModule,
  ]
})
export class CartModule { }
