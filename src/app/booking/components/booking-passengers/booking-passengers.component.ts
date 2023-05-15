import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IAgeCategory, IPassenger } from 'backend/types';
import { map, Observable } from 'rxjs';
import { IAgeTypeQuantity } from '../../../models/agetype-quantity.model';

import { ICountryCode } from '../../../models/countryCode';
import { ISearchForm } from '../../../models/search-form.model';
import { IUser } from '../../../models/user';
import { selectPassengers } from '../../../store/selectors/search.selectors';
import { selectUserProfile } from '../../../store/selectors/user.selectors';
import { AppState } from '../../../store/state.models';
import { UserService } from '../../../user/services/user.service';
import { getAge } from '../../../utils/getAge';
import { PassengersService } from '../../services/passengers.service';

@Component({
  selector: 'app-booking-passengers',
  templateUrl: './booking-passengers.component.html',
  styleUrls: ['./booking-passengers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingPassengersComponent implements OnInit {
  public passengersCollectionForm: FormGroup;

  public searchForm$!: Observable<ISearchForm | any>;
  public userProfile$!: Observable<IUser>;

  public passengersQuauntity = 0;

  public checked = false;
  public disabled = false;

  public countryCodes$: Observable<ICountryCode[]>;

  public detailsForm: FormGroup;

  public ageCategoryCollection: string[] = [];

  public passengers: IPassenger[] = [];

  public infoText =
    "Add the passenger's name as it is written on their documents (passport or ID). Do not use any accents or special characters. Do not use a nickname.";

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private passengersService: PassengersService,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.passengersCollectionForm = this.fb.group({
      passengers: this.fb.array([]),
    });

    this.searchForm$ = this.store.select(selectPassengers);
    this.searchForm$
      .pipe(
        map((passengers) => {
          passengers.forEach(
            (person: IAgeTypeQuantity) =>
              (this.passengersQuauntity += person.quantity)
          );
          this.setAgeCategories(passengers);
        })
      )
      .subscribe();

    this.userProfile$ = this.store.select(selectUserProfile);
    this.userProfile$
      .pipe(
        map((userProfile) => {
          this.createDetailsForm(userProfile as IUser);
        })
      )
      .subscribe();

    for (let i = 0; i < this.passengersQuauntity; i++) {
      this.addPassengerForm();
    }

    this.getCountryCodes();
  }

  get passengersForms() {
    return this.passengersCollectionForm.get('passengers') as FormArray;
  }

  get phone() {
    return this.detailsForm.controls['phone'];
  }

  public addPassengerForm() {
    const passenger = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', [Validators.required]],
      gender: ['male'],
      birthday: ['', [Validators.required]],
      assistance: [false],
    });

    this.passengersForms.push(passenger);
  }

  public createNewPassenger(): IPassenger {
    return {
      id: '',
      firstName: '',
      lastName: '',
      birthday: '',
      age: 0,
      ageCategory: IAgeCategory.infant,
      seatNo: '',
    };
  }

  public setAgeCategories(persons: IAgeTypeQuantity[]): void {
    persons.forEach((person) => {
      for (let i = 0; i < person.quantity; i++) {
        this.ageCategoryCollection.push(person.ageCategory as string);
      }
    });
  }

  public setPassengersCollection(passengers: IPassenger[]) {
    passengers.forEach((person, i) => {
      const newPerson = this.createNewPassenger();
      newPerson.firstName = person.firstName;
      newPerson.lastName = person.lastName;
      newPerson.birthday = person.birthday;
      newPerson.age = this.calculateAge(person.birthday);
      newPerson.ageCategory = this.ageCategoryCollection[i] as IAgeCategory;
      this.passengers.push(newPerson as IPassenger);
    });
  }

  public getCountryCodes(): Observable<ICountryCode[]> {
    this.countryCodes$ = this.userService.getCountryCodes();
    return this.countryCodes$;
  }

  public createDetailsForm(userProfile: IUser): void {
    this.detailsForm = new FormGroup({
      countryCode: new FormControl(
        userProfile.contactDetails?.countryCode,
        Validators.required
      ),
      phone: new FormControl(userProfile.contactDetails?.phone, [
        Validators.required,
        Validators.pattern('[0-9]*'),
      ]),
      email: new FormControl(userProfile.email, [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  public birthdateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = new Date(control.value).getTime();
      if (!value) return null;
      else {
        const age = getAge(value);
        return age >= 18 ? null : { birthdateValidator: true };
      }
    };
  }

  public formSubmit(routeToNavigate: string): void {
    this.setPassengersCollection(
      this.passengersCollectionForm.value.passengers
    );
    this.passengersService.setPassengers(this.passengers);
    this.passengersService.setContactDetails({
      countryCode: this.detailsForm.controls['countryCode'].value,
      phone: this.detailsForm.controls['phone'].value,
    });

    const trip_id = localStorage.getItem('aviator_trip_id') as string;
    this.passengersService.savePassengers(this.passengers, trip_id);
    setTimeout(() => {
      this.passengersService.errorMessage$.subscribe((error) => {
        if (error !== '') {
          this.passengersCollectionForm.setErrors({
            savePassengersError: true,
          });
        }
        if (error === '') {
          this.router.navigate([routeToNavigate]);
        }
      });
    }, 500);
  }

  public onBackClick() {
    this.formSubmit('flights');
  }

  public onNextClick() {
    this.formSubmit('summary');
  }

  private calculateAge(date: string): number {
    const birthday: any = new Date(date);
    const today: any = new Date();

    const age = (today - birthday) / (1000 * 3600 * 24) / 365;
    return Math.floor(age);
  }
}
