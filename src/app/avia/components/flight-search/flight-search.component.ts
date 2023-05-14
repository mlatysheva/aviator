import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAirport } from '../../../models/airport';
import { Observable } from 'rxjs';

import { AviaService } from '../../services/avia.service';
import { IAgeTypeQuantity } from '../../../models/agetype-quantity.model';
import { MatOption } from '@angular/material/core';
import { Router } from '@angular/router';
import { TRIP_TYPE } from '../../../constants/localStorage';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/state.models';
import { setSearchForm } from '../../../store/actions/search.actions';
import { IAgeCategory } from 'src/app/models/passenger';
import { setSearchParameters } from 'src/app/store/actions/trip.actions';
import { setSelectedAiroports, setSelectedDepartureDate, setSelectedDestinationAiroportName, setSelectedDestinationCity, setSelectedOriginAiroportName, setSelectedOriginCity, setSelectedReturnDate, setSelectedTripType } from 'src/app/store/actions/select.actions';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss'],
})

export class FlightSearchComponent implements OnInit {
  @ViewChild(MatOption) matOption: MatOption;

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

  constructor(
    private aviaService: AviaService,
    private router: Router,
    private store: Store<AppState>,
    private fb: FormBuilder
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
    this.state$.subscribe((state: AppState) => {
      this.dateFormat = state.user.dateFormat;

    });
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
    if (this.searchForm.valid) {
      this.aviaService.search();
    }
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
      })
    );
    this.store.dispatch(setSelectedTripType({ roundTrip: this.searchForm.controls['tripType'].value === 'round-trip' ? true : false })
    );
    this.store.dispatch(setSelectedDepartureDate({ outboundDepartureDate: this.searchForm.controls['startDate'].value }
    )
    );
    this.store.dispatch(setSelectedReturnDate({ returnDepartureDate: this.searchForm.controls['endDate'].value })
    );
    this.store.dispatch(setSelectedOriginCity({
      originCity: this.getCityName(this.searchForm.controls['departure'].value
      )
    })
    );
    this.store.dispatch(setSelectedDestinationCity({
      destinationCity: this.getCityName(this.searchForm.controls['destination'].value)
    })
    );
    this.store.dispatch(setSelectedAiroports({
      airportsIataCodes: [this.searchForm.controls['departure'].value.split(',').slice(2, 3).join(''),
      this.searchForm.controls['destination'].value.split(',').slice(2, 3).join('')]
    })
    );
    this.store.dispatch(setSelectedOriginAiroportName({

      originAiroportName: this.searchForm.controls['departure'].value.split(',').slice(0, 2).join('')
    })
    );
    this.store.dispatch(setSelectedDestinationAiroportName({
      destinationAiroportName: this.searchForm.controls['destination'].value.split(',').slice(0, 2).join('')
    })
    );



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
}
