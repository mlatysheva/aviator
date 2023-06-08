import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAirport } from '../../../models/airport';
import { Observable, Subscription } from 'rxjs';

import { AviaService } from '../../services/avia.service';
import { IAgeTypeQuantity } from '../../../models/agetype-quantity.model';
import { Router } from '@angular/router';
import { TRIP_TYPE } from '../../../constants/localStorage';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/state.models';
import { IAgeCategory } from '../../../models/passenger';
import { setSearchParameters } from '../../../store/actions/trip.actions';
import { progressBar } from '../../../constants/progressBar';
import { ProgressBarService } from '../../../core/services/progress-bar.service';
import { EditModeService } from '../../../shared/services/edit-mode.service';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss'],
})
export class FlightSearchComponent implements OnInit, OnDestroy {
  public searchForm: FormGroup;

  public airports$: Observable<IAirport[]>;

  public passengersList: IAgeTypeQuantity[] = [
    { ageCategory: IAgeCategory.adult, quantity: 1 },
    { ageCategory: IAgeCategory.child, quantity: 0 },
    { ageCategory: IAgeCategory.infant, quantity: 0 },
  ];

  tripType = localStorage.getItem(TRIP_TYPE) || 'round-trip';

  dateFormat: string;

  state$: Observable<AppState>;

  public selectedItems: IAgeTypeQuantity[] = [];

  public isRoundTrip = false;

  private subscriptions = new Subscription();

  constructor(
    public aviaService: AviaService,
    private router: Router,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private progressBarService: ProgressBarService,
    private editModeService: EditModeService
  ) {
    this.passengersList.map((option) => this.selectedItems.push(option));
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      tripType: ['round-trip'],
      departure: ['', [Validators.required]],
      destination: ['', [Validators.required]],
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

    this.subscriptions.add(
      this.searchForm.controls['departure'].valueChanges.subscribe(() => {
        this.updateFieldsEqualityValidation();
      })
    );
    this.subscriptions.add(
      this.searchForm.controls['destination'].valueChanges.subscribe(() => {
        this.updateFieldsEqualityValidation();
      })
    );
    this.aviaService.roundTrip$.next(true);
    this.subscriptions.add(
      this.aviaService.roundTrip$.subscribe(
        (isRoundTrip) => (this.isRoundTrip = isRoundTrip)
      )
    );
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
    this.aviaService.changeHeaderStyle$.next(true);

    this.store.dispatch(
      setSearchParameters({
        roundTrip: this.searchForm.controls['tripType'].value === 'round-trip',
        originCity: this.getCityName(
          this.searchForm.controls['departure'].value
        ),
        destinationCity: this.getCityName(
          this.searchForm.controls['destination'].value
        ),
        airportsIataCodeOrigin: this.searchForm.controls['departure'].value
          .split(',')
          .slice(2, 3)
          .join('')
          .trim(),

        airportsIataCodeDestination: this.searchForm.controls[
          'destination'
        ].value
          .split(',')
          .slice(2, 3)
          .join(''),

        outboundDepartureDate: this.searchForm.controls['startDate'].value,
        originAiroportName: this.searchForm.controls['departure'].value
          .split(',')
          .slice(0, 1)
          .join(''),
        destinationAiroportName: this.searchForm.controls['destination'].value
          .split(',')
          .slice(0, 1)
          .join(''),
        returnDepartureDate: this.searchForm.controls['endDate'].value,
        numberOfPassengers: this.searchForm.controls['passengers'].value,
        isPaid: false,
      })
    );

    this.progressBarService.progressBar$.next(progressBar.FLIGHTS);

    this.editModeService.isEditButtonVisible$.next(true);

    this.router.navigate(['flights']);
  }

  public radioChange(isRoundTrip: boolean): void {
    this.aviaService.roundTrip$.next(isRoundTrip);
  }

  private getCityName(controlValue: string): string {
    if (controlValue) {
      let resultString = '';
      const airportArray = controlValue.split(',');
      resultString = airportArray[1];
      return resultString.trim();
    } else return '';
  }

  private updateFieldsEqualityValidation() {
    const departure = this.searchForm.controls['departure'].value;
    const destination = this.searchForm.controls['destination'].value;

    if (departure && destination && departure.trim() === destination.trim()) {
      this.searchForm.controls['departure'].setErrors({ equalityError: true });
      this.searchForm.controls['destination'].setErrors({
        equalityError: true,
      });
    } else {
      this.searchForm.controls['departure'].setErrors(null);
      this.searchForm.controls['destination'].setErrors(null);
    }

    this.searchForm.controls['departure'].markAsTouched();
    this.searchForm.controls['destination'].markAsTouched();
  }

  private stopPropagationFn(event: Event) {
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
