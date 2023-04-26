import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  get login() {
    return this.loginForm.controls['login'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }  

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required, Validators.email]],
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

  onSubmit() {
    const login = this.loginForm.value.login;
    const password = this.loginForm.value.password;
    console.log(`login is ${login} and password is ${password}`);
    // this.authService.onLogin(login, password);
  }
}
