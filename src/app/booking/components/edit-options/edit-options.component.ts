import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  FormBuilder, FormControl, FormGroup,
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/state.models';
import { EditModeService } from '../../../shared/services/edit-mode.service';
import { IAgeTypeQuantity } from '../../../models/agetype-quantity.model';
import { AviaService } from '../../../avia/services/avia.service';
import { IAirport } from '../../../models/airport';
import { TRIP_TYPE } from '../../../constants/localStorage';
import { IAgeCategory } from '../../../models/passenger';
import * as SelectActions from '../../../store/actions/select.actions';
import { DateService } from '../../services/date.service';
import { SumPriceService } from '../../services/sum-price.service';
import { IFlight } from 'src/app/models/flight';


@Component({
  selector: 'app-edit-options',
  templateUrl: './edit-options.component.html',
  styleUrls: ['./edit-options.component.scss']
})
export class EditOptionsComponent implements OnInit, OnDestroy {

  @ViewChild(MatOption) matOption: MatOption;

  isEdit: boolean;

  private subscriptions = new Subscription();

  public selectedItems: IAgeTypeQuantity[] = [];

  public airports$: Observable<IAirport[]>;

  tripType = localStorage.getItem(TRIP_TYPE) || 'round-trip';

  codFrom: string;
  codTo: string;
  start: string;
  state$: Observable<AppState>;
  state: AppState;

  public passengersList: IAgeTypeQuantity[] = [
    { ageCategory: IAgeCategory.adult, quantity: 1 },
    { ageCategory: IAgeCategory.child, quantity: 0 },
    { ageCategory: IAgeCategory.infant, quantity: 0 },
  ];

  departure = new FormControl('');
  destination = new FormControl('');
  startDate = new FormControl('');
  endDate = new FormControl('');
  passengers = new FormControl(this.selectedItems);
  totalAmount: { adultPrice: number; childPrice: number; infantPrice: number; sumPrice: number; totalTax?: number | undefined; };
  index: number;
  changedFlight: IFlight[] = [];
  duration: number;

  public editForm: FormGroup;
  flightDaysTo: number[];


  constructor(
    public editService: EditModeService,
    private builder: FormBuilder,
    private aviaService: AviaService,
    private store: Store<AppState>,
    private dateService: DateService,
    private sumPriceService: SumPriceService
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
    this.getAirportsList();

    this.editForm = this.builder.group({
      departure: this.departure,
      destination: this.destination,
      startDate: this.startDate,
      endDate: this.endDate,
      passengers: this.passengers
    });

  }

  public getAirportsList(): Observable<IAirport[]> {
    this.airports$ = this.aviaService.getAirports();
    return this.airports$;
  }
  get departureName() {
    return this.editForm.get('departure');
  }
  get destinationName() {
    return this.editForm.get('destination');
  }

  onDepartureChange(event: any): void {
    this.codFrom = (this.departureName?.value.split(',')
      .slice(2, 3)
      .join(''));
    this.store.dispatch(SelectActions.setSelectedOriginCity({
      originCity: this.departureName?.value
        .split(',')
        .slice(1, 2)
        .join('')
    }));
    this.store.dispatch(SelectActions.setSelectedOriginAiroportName({
      originAiroportName: this.departureName?.value
        .split(',')
        .slice(0, 1)
        .join('')
    }));
    this.store.dispatch(SelectActions.setSelectedAiroportCodeOrigin({
      airportsIataCodeOrigin: this.codFrom
    }));

    this.subscriptions.add(
      this.state$.subscribe((state: AppState) => {
        this.codTo = state.trip.airportsIataCodeDestination;
      }
      ));
    this.changeFlight(this.codFrom, this.codTo);
  }

  onDestinationChange(event: any): void {
    this.codTo = (this.destinationName?.value.split(',')
      .slice(2, 3)
      .join(''));
    this.store.dispatch(SelectActions.setSelectedDestinationCity({
      destinationCity: this.destinationName?.value
        .split(',')
        .slice(1, 2)
        .join('')
    }));
    this.store.dispatch(SelectActions.setSelectedDestinationAiroportName({
      destinationAiroportName: this.destinationName?.value
        .split(',')
        .slice(0, 1)
        .join('')
    }));
    this.store.dispatch(SelectActions.setSelectedAiroportCodeDestination({
      airportsIataCodeDestination: this.codTo
    }));

    this.subscriptions.add(
      this.state$.subscribe((state: AppState) => {
        this.codFrom = state.trip.airportsIataCodeOrigin;
      }
      ));

    this.changeFlight(this.codFrom, this.codTo);
  }

  changeFlight(from: string, to: string) {
    this.aviaService.getAllFlights().subscribe((flights) => {
      const result = flights.filter((flight) => {
        return flight.originAirportIataCode === from.toString().trim() &&
          flight.destinationAirportIataCode === to.toString().trim();
      });
      if (result !== undefined && result.length > 0) {
        this.changedFlight.push(result[0]);
        this.store.dispatch(SelectActions.setSelectedOutboundDepartureTime({
          outboundDepartureTime: this.changedFlight[0].departureTime,
        }));
        this.store.dispatch(SelectActions.setSelectedOutboundFlightNo({
          outboundFlightNo: this.changedFlight[0].flightNumber,
        }));

      }
    });
    if (this.changedFlight !== undefined && this.changedFlight.length > 0) {
      this.duration = this.changedFlight[0].duration;
      this.flightDaysTo = this.changedFlight[0].flightDays;
      // console.log(this.flightDaysTo, this.changedFlight[0], this.duration);
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
    }

  }
  getTripState() {
    this.subscriptions.add(
      this.state$.subscribe((state: AppState) => {
        this.start = state.trip.outboundDepartureDate;
        // if (this.flightDaysTo !== undefined) {
        //   this.index = this.flightDaysTo.indexOf(this.dateService.getIndexOfDate(this.start, this.flightDaysTo));
        //   this.totalAmount = this.sumPriceService.sumpPrices(this.changedFlight[0], state.trip.numberOfPassengers, this.index);
        //   this.store.dispatch(SelectActions.setSelectedTotalAmount({ totalAmount: this.totalAmount }));
        // }
      }));
  }

  public increase(event: Event, specificAgeType: IAgeTypeQuantity) {
    specificAgeType.quantity++;
    // this.stopPropagationFn(event);
  }

  public decrease(event: Event, specificAgeType: IAgeTypeQuantity) {
    if (specificAgeType.quantity > 0) {
      specificAgeType.quantity--;
    }
    //this.stopPropagationFn(event);
  }

  private stopPropagationFn(event: Event) {
    event.stopPropagation();
    this.matOption._selectViaInteraction();
  }

  onSubmit() {
    // console.log(this.editForm.value.destination);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
