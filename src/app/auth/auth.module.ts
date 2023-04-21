import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ModalComponent } from './components/modal/modal.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [LoginComponent, SignInComponent, ModalComponent],
  imports: [CommonModule, MatTabsModule],
  exports: [ModalComponent],
})
export class AuthModule {}
