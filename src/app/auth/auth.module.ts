import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ModalComponent } from './components/modal/modal.component';
import { MatTabsModule } from '@angular/material/tabs';
import {
  FacebookLoginProvider,
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [LoginComponent, SignInComponent, ModalComponent],
  imports: [CommonModule, MatTabsModule, ReactiveFormsModule,
    SocialLoginModule, SharedModule, MatIconModule, MatButtonModule],
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
