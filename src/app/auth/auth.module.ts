import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ModalComponent } from './components/modal/modal.component';
import {
  FacebookLoginProvider,
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
@NgModule({
  declarations: [LoginComponent, SignInComponent, ModalComponent],
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    SocialLoginModule, 
    SharedModule,
    MatFormFieldModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
    providers: [
      {
        provide: 'SocialAuthServiceConfig',
        useValue: {
          autoLogin: false,
          providers: [
            {
              id: FacebookLoginProvider.PROVIDER_ID,
              provider: new FacebookLoginProvider('Facebook-App-ID-Goes-Here'),
            },
          ],
        } as SocialAuthServiceConfig,
      },
    ],
  exports: [ModalComponent],
})
export class AuthModule {}
