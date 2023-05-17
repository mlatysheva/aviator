import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { IAirport } from '../../../models/airport';
import { Observable, Subscription } from 'rxjs';

import { AviaService } from '../../services/avia.service';
import { IAgeTypeQuantity } from '../../../models/agetype-quantity.model';
import { MatOption } from '@angular/material/core';
import { Router } from '@angular/router';
import { TRIP_TYPE } from '../../../constants/localStorage';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/state.models';
import { setSearchForm } from '../../../store/actions/search.actions';
import { IAgeCategory } from '../../../models/passenger';
import { setSearchParameters } from '../../../store/actions/trip.actions';
import { IProgressBar } from '../../../models/progress-bar';
import { images } from '../../../constants/progressBarImgUrls';
import { ProgressBarService } from '../../../core/services/progress-bar.service';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss'],
})
export class FlightSearchComponent implements OnInit, OnDestroy {
  @ViewChild(MatOption) matOption: MatOption;

  public searchForm: FormGroup;

  public airports$: Observable<IAirport[]>;

  public passengersList: IAgeTypeQuantity[] = [
    { ageCategory: IAgeCategory.adult, quantity: 1, fare: 0, tax: 0 },
    { ageCategory: IAgeCategory.child, quantity: 0, fare: 0, tax: 0 },
    { ageCategory: IAgeCategory.infant, quantity: 0, fare: 0, tax: 0 },
  ];

  tripType = localStorage.getItem(TRIP_TYPE) || 'round-trip';

  dateFormat: string;

  state$: Observable<AppState>;

  public selectedItems: IAgeTypeQuantity[] = [];

  public progressBar: IProgressBar[] = [
    { stepNo: 1, imgUrl: images.STEP_EDIT, text: 'Flights' },
    { stepNo: 2, imgUrl: images.STEP_2, text: 'Passengers' },
    { stepNo: 3, imgUrl: images.STEP_3, text: 'Review & Payment' },
  ];

  private subscriptions = new Subscription();

  constructor(
    private aviaService: AviaService,
    private router: Router,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private progressBarService: ProgressBarService
  ) {
    this.passengersList.map((option) => this.selectedItems.push(option));
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      tripType: ['round-trip'],
      departure: [
        '',
        [Validators.required, this.airportValidator('destination')],
      ],
      destination: [
        '',
        [Validators.required, this.airportValidator('departure')],
      ],
      startDate: ['', [Validators.required]],
      endDate: [''],
      passengers: [this.selectedItems, Validators.required],
    });
    this.getAirportsList();
    this.state$ = this.store.select((appState) => appState);
    this.subscriptions.add(
      this.state$.subscribe((state: AppState) => {
        this.dateFormat = state.user.dateFormat;
      })
    );
  }

  airportValidator(typeToCompare: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value.trim() as string;
      // if (!value) return null;
      // else {
      return value &&
        value === this.searchForm.controls[typeToCompare].value.trim()
        ? { airportValidator: true }
        : null;
      // }
    };
  }

  get departure() {
    return this.searchForm.controls['departure'];
  }

  get destination() {
    return this.searchForm.controls['destination'];
  }

  get passengers() {
    return this.searchForm.controls['passengers'];
  }

  public getAirportsList(): Observable<IAirport[]> {
    this.airports$ = this.aviaService.getAirports();
    return this.airports$;
  }

  public changeValues(): void {
    const departure = this.searchForm.get('departure')?.value;
    const destination = this.searchForm.get('destination')?.value;
    this.searchForm.controls['departure'].setValue(destination);
    this.searchForm.controls['destination'].setValue(departure);
  }

  public increase(event: Event, specificAgeType: IAgeTypeQuantity) {
    specificAgeType.quantity++;
    this.stopPropagationFn(event);
  }

  public decrease(event: Event, specificAgeType: IAgeTypeQuantity) {
    if (specificAgeType.quantity > 0) {
      specificAgeType.quantity--;
    }
    this.stopPropagationFn(event);
  }

  public onSearch() {
    this.aviaService.isSearchSubmitted$.next(true);

    this.store.dispatch(
      setSearchParameters({
        roundTrip: this.searchForm.controls['tripType'].value === 'round-trip',
        originCity: this.getCityName(
          this.searchForm.controls['departure'].value
        ),
        destinationCity: this.getCityName(
          this.searchForm.controls['destination'].value
        ),
        airportsIataCodes: [
          this.searchForm.controls['departure'].value
            .split(',')
            .slice(2, 3)
            .join(''),
          this.searchForm.controls['destination'].value
            .split(',')
            .slice(2, 3)
            .join(''),
        ],
        outboundDepartureDate: this.searchForm.controls['startDate'].value,
        originAiroportName: this.searchForm.controls['departure'].value
          .split(',')
          .slice(0, 2)
          .join(''),
        destinationAiroportName: this.searchForm.controls['destination'].value
          .split(',')
          .slice(0, 2)
          .join(''),
        returnDepartureDate: this.searchForm.controls['endDate'].value,
        numberOfPassengers: this.searchForm.controls['passengers'].value,
      })
    );

    this.progressBarService.setProgressBar(this.progressBar);

    // TODO: get rid of search in store because all the data is currently stored in trip structure
    this.store.dispatch(setSearchForm(this.searchForm.value));
    this.router.navigate(['flights']);
  }

  private getCityName(controlValue: string): string {
    let resultString = '';
    const airportArray = controlValue.split(',');
    resultString = airportArray[1];
    return resultString.trim();
  }

  private stopPropagationFn(event: Event) {
    event.stopPropagation();
    this.matOption._selectViaInteraction();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
