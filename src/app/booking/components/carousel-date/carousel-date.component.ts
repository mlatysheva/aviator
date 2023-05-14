import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import getSymbolFromCurrency from 'currency-symbol-map';
import { AppState } from '../../../store/state.models';
import { AviaService } from '../../../avia/services/avia.service';
import { IFlight } from '../../../models/flight';
import { DateService } from '../../services/date.service';
import { FlightDetailsComponent } from '../flight-details/flight-details.component';
import { SumPriceService } from '../../services/sum-price.service';
import { IAgeTypeQuantity } from '../../../models/agetype-quantity.model';
import { setSelectedTrip } from 'src/app/store/actions/select.actions';

@Component({
  selector: 'app-carousel-date',
  templateUrl: './carousel-date.component.html',
  styleUrls: ['./carousel-date.component.scss'],
})
export class CarouselDateComponent implements OnInit {
  @Input() isFly: string;
  event: Event;
  oneWay: number;

  @ViewChildren(FlightDetailsComponent) el: QueryList<FlightDetailsComponent>;

  $event: MouseEvent;
  isCanFly: boolean;
  isOneWay: boolean;
  isTo: boolean;
  isFlightDay: boolean;
  i: number;

  type: number;

  state$: Observable<AppState>;
  state: AppState;

  // slider
  slides: Array<string>;
  slidesFrom: Array<string>;
  itemsPerSlide = 7;
  singleSlideOffset = true;

  //details of flights
  from: string;
  to: string;
  codFrom: string;
  codTo: string;
  cityFrom: string;
  cityTo: string;
  startDate: string;
  endDate: string;
  currency: string | undefined;
  price: number;
  priceFrom: number;
  prices: number[] = [];
  pricesFrom: number[] = [];
  details$: Observable<IFlight[]>;
  returnDetails$: Observable<IFlight[]>;
  result: IFlight[];
  returnDetails: IFlight[] = [];
  seats: number;
  seatsFrom: number;
  direct: boolean;
  directFrom: boolean;
  flightNumber: string;
  flightNumberFrom: string;
  duration: number;
  durationFrom: number;
  returnFlightId: string;
  flightDaysTo: IFlight["flightDays"] = [];
  flightDaysFrom: IFlight["flightDays"] = [];
  numberOfPassengers: IAgeTypeQuantity[];
  passengersFrom: IAgeTypeQuantity[];
  totalAmount: number;
  totalAmountFrom: number;
  totalTax: number | undefined;
  totalTaxFrom: number;

  //time
  hours: number;
  minutes: number;
  timeZoneFrom: string | undefined;
  timeZoneTo: string | undefined;
  departureTime: string;
  departureTimeFrom: string;
  arrivingDateTo: string | undefined;
  arrivingDateFrom?: string | undefined;
  hoursFrom: number;
  minutesFrom: number;
  dateFormat: string;

  constructor(
    private store: Store<AppState>,
    private aviaService: AviaService,
    public dateService: DateService,
    private sumPriceService: SumPriceService,

  ) { }


  public getDetailsList(from: string, to: string): Observable<IFlight[]> {
    this.details$ = this.aviaService.getAllFlights();
    this.details$.subscribe((value) => {
      for (let i = 0; i < value.length; i++) {
        const result = value.filter(
          (item) =>
            item.originAirportIataCode === from.toString().trim() &&
            item.destinationAirportIataCode === to.toString().trim()
        );
        this.result = result;
      }
      if (this.result[0] !== undefined && this.result.length > 0)
        this.price = this.result[0].pricesAdult[0];
      this.prices = this.result[0].pricesAdult;
      this.seats = this.result[0].totalSeats;
      this.departureTime = this.result[0].departureTime;
      this.direct = this.result[0].direct;
      this.flightNumber = this.result[0].flightNumber;
      this.duration = this.result[0].duration;
      this.hours = this.dateService.getHours(this.duration);
      this.minutes = this.dateService.getMinutes(this.duration);
      this.arrivingDateTo = this.dateService.getArrivingDate(
        this.startDate,
        this.departureTime,
        this.duration,
      );
      this.returnFlightId = this.result[0].returnFlightId;
      this.getReturnDetailsList(this.returnFlightId);
      this.flightDaysTo = this.result[0].flightDays;
      this.prices = this.result[0].pricesAdult;
      this.totalTax = this.sumPriceService.sumpPricesAdult(this.result[0], this.numberOfPassengers).totalTax;
      this.totalAmount = this.sumPriceService.sumpPricesAdult(this.result[0], this.numberOfPassengers).sumPrice;
    });
    return this.details$;
  }

  public getReturnDetailsList(id: string): Observable<IFlight[]> {
    this.returnDetails$ = this.aviaService.getAllFlights();
    this.returnDetails$.subscribe((value) => {
      for (let i = 0; i < value.length; i++) {
        this.returnDetails.push(value[i]);
        const result = this.returnDetails.filter(
          (item) => item.id === id.trim()
        );
        this.returnDetails = result;
      }
      if (this.returnDetails[0] !== undefined && this.returnDetails.length > 0)
        this.priceFrom = this.returnDetails[0].pricesAdult[0];
      this.pricesFrom = this.returnDetails[0].pricesAdult;
      this.seatsFrom = this.returnDetails[0].totalSeats;
      this.departureTimeFrom = this.returnDetails[0].departureTime;
      this.directFrom = this.returnDetails[0].direct;
      this.flightNumberFrom = this.returnDetails[0].flightNumber;
      this.durationFrom = this.returnDetails[0].duration;
      this.hoursFrom = this.dateService.getHours(this.durationFrom);
      this.minutesFrom = this.dateService.getMinutes(this.durationFrom);
      this.arrivingDateFrom = this.dateService.getArrivingDate(this.endDate, this.departureTimeFrom, this.durationFrom);
      this.flightDaysFrom = this.returnDetails[0].flightDays;
    }
    );
    return this.returnDetails$;
  }

  ngOnInit() {
    this.state$ = this.store.select((appState) => appState);
    this.state$.subscribe((state: AppState) => {
      this.from = state.search.departure.split(',').slice(0, 2).join('');
      this.to = state.search.destination.split(',').slice(0, 2).join('');
      this.codFrom = state.search.departure.split(',').slice(2, 3).join('');
      this.codTo = state.search.destination.split(',').slice(2, 3).join('');
      this.cityFrom = state.search.departure
        .split(',')
        .slice(1, 2)
        .join('')
        .trim();
      this.cityTo = state.search.destination
        .split(',')
        .slice(1, 2)
        .join('')
        .trim();
      this.startDate = state.search.startDate;
      console.log(this.startDate, new Date(this.startDate).toISOString().split('T')[0]);
      this.endDate = state.search.endDate;
      this.currency = getSymbolFromCurrency(state.user.currency);
      this.isOneWay = state.search.tripType === 'one-way' ? true : false;
      this.numberOfPassengers = state.search.passengers;
      this.oneWay = state.search.tripType === 'one-way' ? 0 : 1;
      this.dateFormat = state.user.dateFormat;

    }
    );
    this.getDetailsList(this.codFrom, this.codTo);
    this.isCanFly = this.dateService.isCanFly(this.startDate);
    this.isFly = this.isCanFly ? 'true' : 'false';
    this.timeZoneFrom = this.dateService.findOffset(this.cityFrom);
    this.timeZoneTo = this.dateService.findOffset(this.cityTo);
    this.slides = this.dateService.dateSlideTo(this.startDate);
    this.slidesFrom = this.dateService.dateSlideTo(this.endDate);
  }

  onClick(e: Event) {
    const element = e.target as HTMLElement;
    if (element.classList.contains('slide')) {
      element.classList.toggle('large');
      const children = element.children;
      if (element.dataset['index'] === '1') {
        this.startDate = element.id;
        this.arrivingDateTo = this.dateService.getArrivingDate(this.startDate, this.departureTime, this.duration,);

      }
      if (element.dataset['index'] === '2') {
        this.endDate = element.id;
        this.arrivingDateFrom = this.dateService.getArrivingDate(this.endDate, this.departureTimeFrom, this.duration);
      }
      for (let i = 0; i < children.length; i++) {
        if (children[i].classList.contains('slide-date')) {
          children[i].classList.toggle('big-date');

        }
        if (children[i].classList.contains('slide-weekday')) {
          children[i].classList.toggle('big-weekday');
        }
        if (children[i].classList.contains('slide-price')) {
          children[i].classList.toggle('big-price');
        }
      }
    }
  }

}
