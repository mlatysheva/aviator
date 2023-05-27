import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  FormBuilder, FormControl, FormGroup,
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatOptionSelectionChange } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/state.models';
import { EditModeService } from '../../../shared/services/edit-mode.service';
import { IAgeTypeQuantity } from '../../../models/agetype-quantity.model';
import { AviaService } from '../../../avia/services/avia.service';
import { IAirport } from '../../../models/airport';
import { IAgeCategory } from '../../../models/passenger';
import * as SelectActions from '../../../store/actions/select.actions';
import { IFlight } from '../../../models/flight';
import { DateService } from '../../services/date.service';
import { SumPriceService } from '../../services/sum-price.service';

@Component({
  selector: 'app-edit-options',
  templateUrl: './edit-options.component.html',
  styleUrls: ['./edit-options.component.scss']
})
export class EditOptionsComponent implements OnInit, OnDestroy {

  isEdit: boolean;

  isOneWay: boolean;

  private subscriptions = new Subscription();

  public selectedItems: IAgeTypeQuantity[] = [];

  public airports$: Observable<IAirport[]>;

  codFrom: string;

  codTo: string;

  state$: Observable<AppState>;

  state: AppState;

  returnDetails$: Observable<IFlight[]>;
  returnDetails: IFlight[] = [];

  public passengersList: IAgeTypeQuantity[] = [
    { ageCategory: IAgeCategory.adult, quantity: 1 },
    { ageCategory: IAgeCategory.child, quantity: 0 },
    { ageCategory: IAgeCategory.infant, quantity: 0 },
  ];

  departure = new FormControl('');
  destination = new FormControl('');
  passengers = new FormControl(this.selectedItems);
  totalAmount: { adultPrice: number; childPrice: number; infantPrice: number; sumPrice: number; totalTax?: number | undefined; };
  totalAmountFrom: { adultPrice: number; childPrice: number; infantPrice: number; sumPrice: number; totalTax?: number | undefined; };
  index: number;
  changedFlight: IFlight[] = [];
  duration: number;
  durationFrom: number;
  flightNumber: string;
  flightNumberFrom: string;
  public editForm: FormGroup;
  flightDaysTo: number[];
  startDate: string;
  endDate: string;
  originCity: string;
  destinationCity: string;
  originAiroportName: string;
  destinationAiroportName: string;
  numberOfPassengers: IAgeTypeQuantity[];
  outboundDepartureTime: string;
  returnDepartureDate: string;
  seatsFrom: number;
  seatsTo: number;
  returnFlightId: string;
  returnDepartureTime: string;
  flightDaysFrom: number[];
  pricesTo: number[] = [];
  pricesFrom: number[] = [];
  arrivingTimeTo: string;
  arrivingTimeFrom: string;

  constructor(
    public editService: EditModeService,
    private builder: FormBuilder,
    private aviaService: AviaService,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private dateService: DateService,
    private sumPriceService: SumPriceService
  ) {
    this.isEdit = this.editService.isEdit$.value;
    this.passengersList.map((option) => this.selectedItems.push(option));
    this.state$ = this.store.select((appState) => appState);
    this.editForm = this.builder.group({
      departure: this.departure,
      destination: this.destination,
      passengers: this.passengers
    });
    this.subscriptions.add(
      this.editForm.controls['departure'].valueChanges.subscribe(() => {
        this.updateFieldsEqualityValidation();
      })
    );
    this.subscriptions.add(
      this.editForm.controls['destination'].valueChanges.subscribe(() => {
        this.updateFieldsEqualityValidation();
      })
    );
  }

  ngOnInit() {
    this.subscriptions.add(
      this.editService.isEdit$.subscribe((isEdit) => {
        this.isEdit = isEdit;
      })
    );
    this.subscriptions.add(
      this.state$.subscribe((state: AppState) => {
        this.isOneWay = state.trip.roundTrip === true ? false : true;
        this.codTo = state.trip.airportsIataCodeDestination;
        this.codFrom = state.trip.airportsIataCodeOrigin;
        this.startDate = state.trip.outboundDepartureDate;
        if (this.isOneWay === false && state.trip.returnDepartureDate !== undefined)
          this.endDate = state.trip.returnDepartureDate;

      })
    );

    this.getAirportsList();

  }

  public getAirportsList(): Observable<IAirport[]> {
    this.airports$ = this.aviaService.getAirports();
    return this.airports$;
  }
  get departureChange() {
    return this.editForm.get('departure');
  }
  get destinationChange() {
    return this.editForm.get('destination');
  }

  get passengersChange() {
    return this.editForm.controls['passengers'];
  }

  onDepartureChange(event: MatSelectChange): void {
    event.source.value = this.departureChange?.value;
    this.codFrom = (event.source.value.split(',')
      .slice(2, 3)
      .join(''));

    this.originCity = this.departureChange?.value.split(',')
      .slice(1, 2)
      .join('')
    this.originAiroportName = this.departureChange?.value.split(',')
      .slice(0, 1)
      .join('')
    this.store.dispatch(SelectActions.setSelectedAiroportCodeOrigin({
      airportsIataCodeOrigin: this.codFrom
    }));

    this.store.dispatch(SelectActions.setSelectedOriginCity({
      originCity: this.originCity
    }));
    this.store.dispatch(SelectActions.setSelectedOriginAiroportName({
      originAiroportName: this.originAiroportName
    }));
    this.changeFlight(this.codFrom, this.codTo);
  }

  onDestinationChange(event: MatSelectChange): void {
    event.source.value = this.destinationChange?.value;
    this.codTo = (event.source.value.split(',')
      .slice(2, 3)
      .join(''));

    this.destinationCity = this.destinationChange?.value.split(',')
      .slice(1, 2)
      .join('')
    this.destinationAiroportName = this.destinationChange?.value.split(',')
      .slice(0, 1)
      .join('')

    this.store.dispatch(SelectActions.setSelectedAiroportCodeDestination({
      airportsIataCodeDestination: this.codTo
    }));

    this.store.dispatch(SelectActions.setSelectedDestinationCity({
      destinationCity: this.destinationCity
    }));
    this.store.dispatch(SelectActions.setSelectedDestinationAiroportName({
      destinationAiroportName: this.destinationAiroportName
    }));

    this.changeFlight(this.codFrom, this.codTo);
  }

  onPassengersChange(event: MatOptionSelectionChange): void {
    event.source.value = this.passengersChange?.value;
    // this.numberOfPassengers = event.source.value;
    // console.log(JSON.stringify(event.source.value))
    //console.log(this.passengersChange?.value)
    //console.log(event.source.value, event.source.selected);
    if (event.isUserInput) {    // ignore on deselection of the previous option
      // console.log(event.source.value, event.source.selected);
    }


    // if (this.passengersChange) {
    //   this.passengersList = this.passengersChange;
    //   this.store.dispatch(TripActions.setNumberOfPassengers({
    //     numberOfPassengers: this.passengersChange
    //   }
    //   ));
    // }
    // this.selectedItems = this.passengersChange?.values;
    // this.selectedItems = event.source.value;
    // if (this.passengersChange) {
    //   this.passengersList = this.passengersChange;
    //   this.store.dispatch(TripActions.setNumberOfPassengers({
    //     numberOfPassengers: this.passengersChange
    //   }));
    // }
  }

  changeFlight(from: string, to: string) {
    this.aviaService.getAllFlights().subscribe((flights) => {
      const result = flights.filter((flight) => {
        return flight.originAirportIataCode === from.toString().trim() &&
          flight.destinationAirportIataCode === to.toString().trim();
      });
      if (result !== undefined && result.length > 0) {

        this.changedFlight.push(result[0]);
        this.duration = result[0].duration;
        this.outboundDepartureTime = result[0].departureTime;
        this.arrivingTimeTo = this.dateService.getArrivingDate(this.startDate, this.outboundDepartureTime, this.duration).timeToRender;
        this.flightDaysTo = result[0].flightDays;
        this.flightNumber = result[0].flightNumber;
        this.seatsTo = result[0].seatsTo;
        this.returnFlightId = result[0].returnFlightId;
        this.index = this.dateService.getIndexOfDate(this.startDate, this.flightDaysTo);
        this.totalAmount = this.sumPriceService.sumpPrices(
          result[0],
          this.numberOfPassengers,
          this.index);
        this.pricesTo = result[0].pricesAdult;
        this.store.dispatch(SelectActions.setSelectedTripDuration({ duration: this.duration }));
        this.store.dispatch(SelectActions.setSelectedFlightDaysTo({ flightDaysTo: this.flightDaysTo }));
        this.store.dispatch(SelectActions.setSelectedOutboundFlightNo({
          outboundFlightNo: this.flightNumber,
        }));
        this.store.dispatch(SelectActions.setSelectedTripSeatsTo({ seatsTo: this.seatsTo }));
        this.store.dispatch(SelectActions.setSelectedOutboundDepartureTime({ outboundDepartureTime: this.outboundDepartureTime }));
        this.store.dispatch(SelectActions.setSelectedTotalAmount({ totalAmount: this.totalAmount }));
        if (this.isOneWay === false) {
          this.changeReturnFlight(this.returnFlightId);
        }
        this.store.dispatch(SelectActions.setSelectedPricesTo({ pricesTo: this.pricesTo }));
        this.store.dispatch(SelectActions.setSelectedOutboundArrivalTime({ outboundArrivalTime: this.arrivingTimeTo }));
      }
    });

  }
  changeReturnFlight(id: string): Observable<IFlight[]> {
    this.returnDetails$ = this.aviaService.getAllFlights();
    this.subscriptions.add(
      this.returnDetails$.subscribe((value) => {
        for (let i = 0; i < value.length; i++) {
          this.returnDetails.push(value[i]);
          const result = this.returnDetails.filter(
            (item) => item.id === id.trim()
          );
          this.returnDetails = result;
        }
        if (this.returnDetails !== undefined && this.returnDetails.length > 0)
          this.durationFrom = this.returnDetails[0].duration;
        this.flightNumberFrom = this.returnDetails[0].flightNumber;
        this.seatsFrom = this.returnDetails[0].totalSeats;
        this.returnDepartureTime = this.returnDetails[0].departureTime;
        this.flightDaysFrom = this.returnDetails[0].flightDays;
        this.pricesFrom = this.returnDetails[0].pricesAdult;
        this.arrivingTimeFrom = this.dateService.getArrivingDate(this.endDate, this.returnDepartureTime, this.durationFrom).timeToRender;
        this.store.dispatch(SelectActions.setSelectedTripDurationFrom({ durationFrom: this.durationFrom }));
        this.store.dispatch(SelectActions.setSelectedReturnFlightNo({
          returnFlightNo: this.flightNumberFrom,
        }));
        this.store.dispatch(SelectActions.setSelectedTripSeatsFrom({ seatsFrom: this.seatsFrom }));
        this.store.dispatch(SelectActions.setSelectedReturnDepartureTime({
          returnDepartureTime: this.returnDepartureTime,
        }));
        this.store.dispatch(SelectActions.setSelectedFlightDaysFrom({
          flightDaysFrom: this.flightDaysFrom,
        }));
        this.store.dispatch(SelectActions.setSelectedPricesFrom({ pricesFrom: this.pricesFrom }));
        this.store.dispatch(SelectActions.setSelectedReturnArrivalTime({ returnArrivalTime: this.arrivingTimeFrom }));
      }
      ));
    return this.returnDetails$;
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

  private stopPropagationFn(event: Event) {
    event.stopPropagation();


  }
  private updateFieldsEqualityValidation() {
    const departure = this.departureChange?.value;
    const destination = this.destinationChange?.value;

    if (departure && destination &&
      departure.trim() === destination.trim()) {

      this.departureChange?.setErrors({ notEqual: true });
      this.destinationChange?.setErrors({ notEqual: true });
    }
    else {
      this.departureChange?.setErrors(null);
      this.destinationChange?.setErrors(null);
    }

  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  dateForm = this.formBuilder.group({
    startDate: '',
    endDate: ''
  });

  OnStartDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value !== undefined && event.value !== null) {
      this.startDate = event.value.toString();
      this.store.dispatch(SelectActions.setSelectedDepartureDate({
        outboundDepartureDate: this.startDate
      }));
    }
  }
  OnEndDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value !== undefined && event.value !== null) {
      this.endDate = event.value.toString();
      this.store.dispatch(SelectActions.setSelectedReturnDate({
        returnDepartureDate: this.endDate
      }));

    }
  }
}
