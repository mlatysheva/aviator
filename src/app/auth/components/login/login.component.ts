import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { setUserProfile } from '../../../store/actions/user.actions';
import { USER_EMAIL } from '../../../constants/localStorage';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { selectUserError } from '../../../store/selectors/user.selectors';
import { AppState } from '../../../store/state.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;

  // Error from store, more user friendly
  loginError$: Observable<string>;
  
  // Error from server
  loginError: string;

  errorSubscription: Subscription = new Subscription();

  userId$: string;

  hide = true;

  emailFromLS = localStorage.getItem(USER_EMAIL) || '';

  emailSubscription: Subscription = new Subscription();

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }  

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
  ) { 
    this.loginError$ = this.store.select(selectUserError);
    this.loginError = '';
  }

  ngOnInit() {
    this.emailSubscription = this.authService.email$.subscribe(email => {
      this.emailFromLS = email;
    });
    this.errorSubscription = this.authService.errorMessage$.subscribe(error => {
      this.loginError = error;
    });
    this.loginForm = this.fb.group({
      email: [this.emailFromLS || '', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator()]],
    });
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null;
      else {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*])[A-Za-z\d#$@!%&*]{8,20}$/;
        return passwordRegex.test(value) ? null : { passwordValidator: true };
      }
    };
  }

  onLogin() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.store.dispatch(setUserProfile({ email, password }));
    setTimeout(() => {
      this.authService.errorMessage$.subscribe(
        (error) => {
          if (error !== '') {
            this.loginError = error;
            this.loginForm.setErrors({ loginError: true });
          }
          if (this.loginError == '') {
            this.router.navigate([{ outlets: { modal: null } }]);
          }
        }
      );
    }, 500);
}

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email is required';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Password is required';
    }
    return this.password.hasError('passwordValidator') ? 'Min 8 characters, an uppercase letter, a number and one of [#$@!%&*]' : '';
  }

  ngOnDestroy(): void {
    this.emailSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
