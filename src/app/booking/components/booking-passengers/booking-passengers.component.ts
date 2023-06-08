import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
import { map, Observable, take, Subscription } from 'rxjs';
import { TripState } from '../../../store/reducers/trip.reducer';
import { IAgeTypeQuantity } from '../../../models/agetype-quantity.model';
import { ICountryCode } from '../../../models/countryCode';
import { IUser } from '../../../models/user';
import { selectUserProfile } from '../../../store/selectors/user.selectors';
import { AppState } from '../../../store/state.models';
import { UserService } from '../../../user/services/user.service';
import { getAge } from '../../../utils/getAge';
import { PassengersService } from '../../services/passengers.service';
import { selectTrip } from '../../../store/selectors/trip.selectors';
import { ProgressBarService } from '../../../core/services/progress-bar.service';
import { progressBar } from '../../../constants/progressBar';
import { TRIP_ID } from '../../../constants/localStorage';
import { CartApiService } from '../../../cart/services/cart-api.service';
import { IAgeCategory, IGender, IPassenger } from '../../../models';

@Component({
  selector: 'app-booking-passengers',
  templateUrl: './booking-passengers.component.html',
  styleUrls: ['./booking-passengers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingPassengersComponent implements OnInit, OnDestroy {
  public passengersCollectionForm: FormGroup;

  public trip$!: Observable<TripState | any>;

  public userProfile$!: Observable<IUser>;
  public userProfile: IUser;

  public passengersQuauntity = 0;

  public checked = false;

  public countryCodes$: Observable<ICountryCode[]>;

  public detailsForm: FormGroup;

  public ageCategoryCollection: string[] = [];

  public passengers: IPassenger[] = [];
  public passengersFromStore: IPassenger[] = [];

  public infoText =
    "Add the passenger's name as it is written on their documents (passport or ID). Do not use any accents or special characters. Do not use a nickname.";

  private subscriptions = new Subscription();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private passengersService: PassengersService,
    private fb: FormBuilder,
    private userService: UserService,
    private progressBarService: ProgressBarService,
    private cartService: CartApiService
  ) {}

  ngOnInit() {
    this.passengersCollectionForm = this.fb.group({
      passengers: this.fb.array([]),
    });

    this.trip$ = this.store.select(selectTrip);
    this.trip$
      .pipe(
        map((trip) => {
          trip.numberOfPassengers.forEach(
            (person: IAgeTypeQuantity) =>
              (this.passengersQuauntity += person.quantity)
          );
          this.passengersFromStore = trip.passengers;
          this.setAgeCategories(trip.numberOfPassengers);
        })
      )
      .subscribe();

    this.userProfile$ = this.store.select(selectUserProfile);
    this.subscriptions.add(
      this.userProfile$
        .pipe(
          map((userProfile) => {
            this.userProfile = userProfile;
            this.createDetailsForm(userProfile as IUser);
          })
        )
        .subscribe()
    );

    for (let i = 0; i < this.passengersQuauntity; i++) {
      if (this.passengersFromStore.length) {
        this.addPassengerForm(
          this.passengersFromStore[i].firstName,
          this.passengersFromStore[i].lastName,
          this.passengersFromStore[i].gender,
          this.passengersFromStore[i].birthday
        );
      } else {
        if (i === 0) {
          this.addPassengerForm(
            this.userProfile.firstName,
            this.userProfile.lastName,
            this.userProfile.gender,
            this.userProfile.birthday
          );
        } else if (i > 0) {
          this.addPassengerForm();
        }
      }
    }

    this.getCountryCodes();
  }

  get passengersForms() {
    return this.passengersCollectionForm.get('passengers') as FormArray;
  }

  get phone() {
    return this.detailsForm.controls['phone'];
  }

  public addPassengerForm(
    firstName?: string,
    lastName?: string,
    genger?: IGender,
    birthday?: string
  ) {
    const passenger = this.fb.group({
      firstName: [firstName ? firstName : '', Validators.required],
      lastName: [lastName ? lastName : '', [Validators.required]],
      gender: [genger ? genger : 'male'],
      birthday: [birthday ? birthday : '', [Validators.required]],
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
      gender: IGender.male,
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

    const trip_id = localStorage.getItem(TRIP_ID) as string;
    this.passengersService.savePassengers(this.passengers, trip_id);
    setTimeout(() => {
      this.subscriptions.add(
        this.passengersService.errorMessage$.subscribe((error) => {
          if (error !== '') {
            this.passengersCollectionForm.setErrors({
              savePassengersError: true,
            });
          }
          if (error === '') {
            this.router.navigate([routeToNavigate]);
          }
        })
      );
    }, 500);
  }

  public onBackClick() {
    this.progressBarService.progressBar$.next(progressBar.FLIGHTS);
    this.formSubmit('flights');
  }

  public onNextClick() {
    this.progressBarService.progressBar$.next(progressBar.SUMMARY);

    this.formSubmit('summary');

    const trip$ = this.store.select(selectTrip).pipe(take(1));
    trip$.subscribe((trip: TripState) => {
      this.cartService.updateTrip(trip).subscribe();
    });
  }

  private calculateAge(date: string): number {
    const birthday: any = new Date(date);
    const today: any = new Date();

    const age = (today - birthday) / (1000 * 3600 * 24) / 365;
    return Math.floor(age);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
