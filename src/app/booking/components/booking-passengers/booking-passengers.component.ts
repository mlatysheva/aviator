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
import { IAgeCategory, IPassenger } from 'backend/types';
import { map, Observable } from 'rxjs';
import { IAgeTypeQuantity } from 'src/app/avia/models/agetype-quantity.model';
import { ISearchForm } from 'src/app/avia/models/search-form.model';
import { selectPassengers } from 'src/app/store/selectors/search.selectors';
import { AppState } from 'src/app/store/state.models';
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
  // public passengers: IAgeTypeQuantity[];
  // public cards: IPassenger[] = [];

  // public passengersForm: FormGroup;

  // public checked = false;
  // public disabled = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private passengersService: PassengersService,
    private fb: FormBuilder
  ) {}

  // ngOnInit() {
  //   this.searchForm$ = this.store.select(selectPassengers);
  //   this.searchForm$
  //     .pipe(map((value) => this.setPassengers(value)))
  //     .subscribe();

  //   this.passengersForm = new FormGroup({
  //     firstName: new FormControl('', Validators.required),
  //     lastName: new FormControl('', Validators.required),
  //     genderType: new FormControl('male', Validators.required),
  //     birthDate: new FormControl(''),
  //     assistance: new FormControl(false),
  //   });
  // }

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

  // public onSubmit() {
  //   // console.log(this.passengersForm.value);
  //   // console.log(this.cards);

  //   this.cards.forEach((card) => {
  //     card.firstName = this.passengersForm.get('firstName')?.value;
  //     card.lastName = this.passengersForm.get('lastName')?.value;
  //     card.birthday = this.passengersForm.get('birthDate')?.value;
  //   });

  //   this.passengersService.setPassengers(this.cards);
  // }

  // public onBackClick() {
  //   this.onSubmit();
  //   this.router.navigate(['booking']);
  // }

  // public onNextClick() {
  //   this.onSubmit();
  //   this.router.navigate(['review']);
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
  }

  get passengersForms() {
    return this.passengersCollectionForm.get('passengers') as FormArray;
  }

  addPassenger() {
    const item = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', [Validators.required]],
      gender: ['male'],
      birthday: ['', [Validators.required]],
    });

    this.passengersForms.push(item);
  }

  onSubmit() {
    console.log(this.passengersCollectionForm.value);
  }
}
