import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
// import { IAgeCategory, IPassenger } from 'backend/types';
import { map, Observable } from 'rxjs';
import { IAgeTypeQuantity } from 'src/app/avia/models/agetype-quantity.model';
import { ISearchForm } from 'src/app/avia/models/search-form.model';
import { ICountryCode } from 'src/app/models/countryCode';
import { selectPassengers } from 'src/app/store/selectors/search.selectors';
import { AppState } from 'src/app/store/state.models';
import { UserService } from 'src/app/user/services/user.service';
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

  public passengersQuauntity = 0;

  public gender = 'male';

  public checked = false;
  public disabled = false;

  public countryCodes$: Observable<ICountryCode[]>;

  public detailsForm: FormGroup;

  // public passengers: IAgeTypeQuantity[];
  // public cards: IPassenger[] = [];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private passengersService: PassengersService,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  // public createNewPassenger(): IPassenger {
  //   return {
  //     id: '',
  //     firstName: '',
  //     lastName: '',
  //     birthday: '',
  //     age: 0,
  //     ageCategory: IAgeCategory.infant,
  //     seatNo: '',
  //   };
  // }

  // public setPassengers(persons: IAgeTypeQuantity[]): void {
  //   persons.forEach((person) => {
  //     for (let i = 0; i < person.quantity; i++) {
  //       const newPerson = this.createNewPassenger();
  //       newPerson.ageCategory = person.ageCategory;
  //       this.cards.push(newPerson);
  //     }
  //   });
  // }

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
        })
      )
      .subscribe();

    for (let i = 0; i < this.passengersQuauntity; i++) {
      this.addPassenger();
    }

    this.getCountryCodes();
    this.createDetailsForm();
  }

  get passengersForms() {
    return this.passengersCollectionForm.get('passengers') as FormArray;
  }

  get phone() {
    return this.detailsForm.controls['phone'];
  }

  public addPassenger() {
    const item = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', [Validators.required]],
      gender: ['male'],
      birthday: ['', [Validators.required]],
      assistance: [false],
    });

    this.passengersForms.push(item);
  }

  public getCountryCodes(): Observable<ICountryCode[]> {
    this.countryCodes$ = this.userService.getCountryCodes();
    this.countryCodes$.subscribe((codes) => console.log(codes));
    return this.countryCodes$;
  }

  public createDetailsForm() {
    this.detailsForm = new FormGroup({
      countryCode: new FormControl('+0', Validators.required),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  public onSubmit() {
    console.log(this.passengersCollectionForm.value);
    this.passengersService.setPassengers(
      this.passengersCollectionForm.value.passengers
    );
    this.passengersService.setContactDetails(this.detailsForm.value);
  }

  public onBackClick() {
    this.onSubmit();
    this.router.navigate(['booking']);
  }

  public onNextClick() {
    this.onSubmit();
    this.router.navigate(['review']);
  }
}
