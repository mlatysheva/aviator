import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  FormBuilder, FormControl, FormGroup,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/state.models';
import { EditModeService } from '../../../shared/services/edit-mode.service';
import { IAgeTypeQuantity } from '../../../models/agetype-quantity.model';
import { AviaService } from '../../../avia/services/avia.service';
import { IAirport } from '../../../models/airport';
import { IAgeCategory } from '../../../models/passenger';
import * as SelectActions from '../../../store/actions/select.actions';
import * as TripActions from '../../../store/actions/trip.actions';
import { DateService } from '../../services/date.service';
import { SumPriceService } from '../../services/sum-price.service';
import { IFlight } from 'src/app/models/flight';
import { MatSelectChange } from '@angular/material/select';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatOptionSelectionChange } from '@angular/material/core';


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

  public passengersList: IAgeTypeQuantity[] = [
    { ageCategory: IAgeCategory.adult, quantity: 1 },
    { ageCategory: IAgeCategory.child, quantity: 0 },
    { ageCategory: IAgeCategory.infant, quantity: 0 },
  ];

  departure = new FormControl('');
  destination = new FormControl('');
  passengers = new FormControl(this.selectedItems);
  totalAmount: { adultPrice: number; childPrice: number; infantPrice: number; sumPrice: number; totalTax?: number | undefined; };
  index: number;
  changedFlight: IFlight[] = [];
  duration: number;
  flightNumber: string;
  public editForm: FormGroup;
  flightDaysTo: number[];
  startDate: Date | null;
  endDate: Date;
  originCity: string;
  destinationCity: string;
  originAiroportName: string;
  destinationAiroportName: string;
  numberOfPassengers: IAgeTypeQuantity[];
  outboundDepartureTime: string;

  constructor(
    public editService: EditModeService,
    private builder: FormBuilder,
    private aviaService: AviaService,
    private store: Store<AppState>,
    private dateService: DateService,
    private sumPriceService: SumPriceService,
    private formBuilder: FormBuilder
  ) {
    this.isEdit = this.editService.isEdit$.value;
    this.passengersList.map((option) => this.selectedItems.push(option));
    this.state$ = this.store.select((appState) => appState);
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
      })
    );
    this.getAirportsList();

    this.editForm = this.builder.group({
      departure: this.departure,
      destination: this.destination,
      passengers: this.passengers
    });

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
    return this.editForm.get('passengers');
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

    this.subscriptions.add(
      this.state$.subscribe((state: AppState) => {
        this.codTo = state.trip.airportsIataCodeDestination;
      }
      ));
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

    this.subscriptions.add(
      this.state$.subscribe((state: AppState) => {
        this.codFrom = state.trip.airportsIataCodeOrigin;
      }
      ));

    this.changeFlight(this.codFrom, this.codTo);
  }

  onPassengersChange(event: MatOptionSelectionChange): void {
    // event.source.value = this.passengersChange?.value;
    // this.numberOfPassengers = event.source.value;
    console.log(event.source.value)
    //console.log(this.passengersChange?.value)
    //console.log(event.source.value, event.source.selected);
    if (event.isUserInput) {    // ignore on deselection of the previous option
      console.log(event.source.value, event.source.selected);
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
        //this.changedFlight = [];
        // this.changedFlight.push(result[0]);
        //if (this.changedFlight !== undefined && this.changedFlight.length > 0) {
        this.duration = result[0].duration;
        this.flightDaysTo = result[0].flightDays;
        this.flightNumber = result[0].flightNumber;
        this.outboundDepartureTime = result[0].departureTime;
        // }
        this.store.dispatch(SelectActions.setSelectedOutboundDepartureTime({
          outboundDepartureTime: this.outboundDepartureTime,
        }));
        this.store.dispatch(SelectActions.setSelectedOutboundFlightNo({
          outboundFlightNo: this.flightNumber,
        }));
        this.store.dispatch(SelectActions.setSelectedTripDuration({ duration: this.duration }));
      }
    });
    // if (this.changedFlight !== undefined && this.changedFlight.length > 0) {
    //   this.duration = this.changedFlight[0].duration;
    //   this.flightDaysTo = this.changedFlight[0].flightDays;
    //   console.log(this.flightDaysTo, this.changedFlight[0], this.duration);
    //this.getTripState();
    //if (this.flightDaysTo !== undefined) {
    //   this.subscriptions.add(
    //     this.state$.subscribe((state: AppState) => {
    //       this.start = state.trip.outboundDepartureDate;
    //       this.index = this.flightDaysTo.indexOf(this.dateService.getIndexOfDate(this.start, this.flightDaysTo));
    //       this.totalAmount = this.sumPriceService.sumpPrices(this.changedFlight[0], state.trip.numberOfPassengers, this.index);
    //       this.store.dispatch(SelectActions.setSelectedTotalAmount({ totalAmount: this.totalAmount }));

    //     }));
    // }
    // }

  }
  // getTripState() {
  //   this.subscriptions.add(
  //     this.state$.subscribe((state: AppState) => {
  //       this.start = state.trip.outboundDepartureDate;
  //       // if (this.flightDaysTo !== undefined) {
  //       //   this.index = this.flightDaysTo.indexOf(this.dateService.getIndexOfDate(this.start, this.flightDaysTo));
  //       //   this.totalAmount = this.sumPriceService.sumpPrices(this.changedFlight[0], state.trip.numberOfPassengers, this.index);
  //       //   this.store.dispatch(SelectActions.setSelectedTotalAmount({ totalAmount: this.totalAmount }));
  //       // }
  //     }));
  // }

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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  dateForm = this.formBuilder.group({
    startDate: '',
    endDate: ''
  });

  OnStartDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value !== undefined && event.value !== null) {
      this.startDate = event.value;
      console.log(this.startDate.toDateString());
      this.store.dispatch(SelectActions.setSelectedDepartureDate({
        outboundDepartureDate: this.startDate.toDateString()
      }));
    }
  }
  OnEndDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value !== undefined && event.value !== null) {
      this.endDate = event.value;
      console.log(event.value.toDateString());
      this.store.dispatch(SelectActions.setSelectedReturnDate({
        returnDepartureDate: this.endDate.toDateString()
      }));

    }
  }
}
