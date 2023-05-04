import { Component,  OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { getAge } from '../../../utils/getAge';
import { Observable } from 'rxjs';
import { ICountryCode } from '../../../models/countryCode';
import { UserService } from '../../../user/services/user.service';
import { Router } from '@angular/router';
import { USER_EMAIL } from '../../../constants/localStorage';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;

  public countryCodes$: Observable<ICountryCode[]>;

  userId$: string;

  hidePassword = true;

  get email() {
    return this.signupForm.controls['email'];
  }

  get password() {
    return this.signupForm.controls['password'];
  }  

  get firstName() {
    return this.signupForm.controls['firstName'];
  }

  get lastName() {
    return this.signupForm.controls['lastName'];
  }

  get birthDate() {
    return this.signupForm.controls['birthDate'];
  }

  get gender() {
    return this.signupForm.controls['gender'];
  }

  get countryCode() {
    return this.signupForm.controls['countryCode'];
  }

  get phone() {
    return this.signupForm.controls['phone'];
  }

  get citizenship() {
    return this.signupForm.controls['citizenship'];
  }

  get agreementCheck() {
    return this.signupForm.controls['agreementCheck'];
  }

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    public userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator()]],
      firstName: ['', [Validators.required, Validators.pattern('[A-Za-z]*'), Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.pattern('[A-Za-z]*'), Validators.minLength(3)]],
      birthDate: [null, [Validators.required, this.birthdateValidator()]],
      gender: ['', [Validators.required]],
      countryCode: ['+0', [Validators.required]],
      phone: ['', [Validators.required, 
        Validators.pattern('[0-9]*'), 
        Validators.minLength(10), 
        Validators.maxLength(11)]],
      citizenship: [''],
      agreementCheck: [false, [Validators.required]],
    });
    this.getCountryCodes();
  }

  public getCountryCodes(): Observable<ICountryCode[]> {
    this.countryCodes$ = this.userService.getCountryCodes();
    return this.countryCodes$;
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null;
      else {
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d){8,20}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*])[A-Za-z\d#$@!%&*]{8,20}$/;
        return passwordRegex.test(value) ? null : { passwordValidator: true };
      }
    };
  }

  birthdateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = new Date(control.value).getTime();
      if (!value) return null;
      else {
        const age = getAge(value);
        return age >= 18 ? null : { birthdateValidator: true };
      }
    };
  }

  onSubmit() {
    const { email, password, firstName, lastName, birthDate, gender, countryCode, phone, citizenship } = this.signupForm.value;
    const user = {
      email,
      password,
      firstName,
      lastName,
      birthDate,
      gender,
      citizenship,
      contactDetails: {
        countryCode,
        phone,
      }
    }
    this.userService.registerUser(user).subscribe((res) => {
      localStorage.setItem(USER_EMAIL, email);
      console.log(res);
    });
    this.router.navigate([{ outlets: { modal: null } }]);
    this.router.navigate([{ outlets: { modal: 'auth' } }]);
  }

  getEmailErrorMessage() {
    return this.email.hasError('email') ? 'Email is invalid' : '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('passwordValidator') ? 'Min 8 characters, an uppercase letter, a number and one of [#$@!%&*]' : '';
  }

  getFirstNameErrorMessage() {
    if (this.firstName.hasError('pattern')) {
      return 'Only letters are accepted';
    } 
    return this.firstName.hasError('minLength') ? 'Minimum 3 letters' : '';
  }

  getLastNameErrorMessage() {
    if (this.lastName.hasError('pattern')) {
      return 'Only letters are accepted';
    } 
    return this.lastName.hasError('minLength') ? 'Minimum 3 letters' : '';
  }

  getBirthdateErrorMessage() {
    return this.birthDate.hasError('birthdateValidator') ? 'You should be over 18 y.o. to register' : '';
  }

  getPhoneErrorMessage() {
    if (this.phone.hasError('pattern')) {
      return 'Only numbers are accepted';
    } 
    if (this.phone.hasError('minLength')) {
      return 'Minimum 10 digits';
    } 
    return this.phone.hasError('maxLength') ? 'Maximum 11 digits' : '';
  }

  getAgreementCheckErrorMessage() {
    return this.agreementCheck.hasError('required') ? 'You must agree to the terms and conditions' : '';
  }
}
