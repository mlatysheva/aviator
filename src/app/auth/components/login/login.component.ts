import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { setUserProfile } from '../../../store/actions/user.actions';
import { USER_EMAIL } from '../../../constants/localStorage';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { selectUserError, selectUserProfile } from '../../../store/selectors/user.selectors';
import { AppState } from '../../../store/state.models';
import { IUser } from '../../../models';
import { UserState } from '../../../store/reducers/user.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;

  errorOnProfile$ = this.store.select(selectUserError);

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
  ) { }

  ngOnInit() {
    this.emailSubscription = this.authService.email$.subscribe(email => {
      this.emailFromLS = email;
    });
    this.loginForm = this.fb.group({
      email: [this.emailFromLS || '', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator()]],
    });
    // this.errorOnProfile$ = this.store.select(selectUserError);
    // console.log(this.errorOnProfile$);
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

  onSubmit() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.store.dispatch(setUserProfile({ email, password }));
    if (!this.errorOnProfile$) {
      this.router.navigate([{ outlets: { modal: null } }]);
    }
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
  }
}
