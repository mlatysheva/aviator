import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ModalComponent } from './components/modal/modal.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AuthRoutingModule } from './auth-routing.module';
@NgModule({
  declarations: [LoginComponent, SignupComponent, ModalComponent],
  imports: [
    AuthRoutingModule,
    CommonModule, 
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    SharedModule,
    MatFormFieldModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
    providers: [ ],
  exports: [ModalComponent],
})
export class AuthModule {}
