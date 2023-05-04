import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { setUserProfile } from '../../../store/actions/user.actions';
import { USER_EMAIL, USER_PASSWORD } from '../../../constants/localStorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  userId$: string;

  hide = true;

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }  

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [localStorage.getItem(USER_EMAIL) || '', [Validators.required, Validators.email]],
      password: [localStorage.getItem(USER_PASSWORD) || '', [Validators.required, this.passwordValidator()]],
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

  onSubmit() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.store.dispatch(setUserProfile({ email, password }));
    localStorage.removeItem(USER_PASSWORD);
    this.router.navigate([{ outlets: { modal: null } }]);
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
}
