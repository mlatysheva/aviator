import { Component, OnInit, Input, ViewChildren, QueryList, OnDestroy, ElementRef, ViewChild, } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import getSymbolFromCurrency from 'currency-symbol-map';
import { AppState } from '../../../store/state.models';
import { AviaService } from '../../../avia/services/avia.service';
import { IFlight } from '../../../models/flight';
import { DateService } from '../../services/date.service';
import { FlightDetailsComponent } from '../flight-details/flight-details.component';
import { SumPriceService } from '../../services/sum-price.service';
import { IAgeTypeQuantity } from '../../../models/agetype-quantity.model';
import * as SelectActions from '../../../store/actions/select.actions';
import { EditOptionsComponent } from '../edit-options/edit-options.component';

@Component({
  selector: 'app-carousel-date',
  templateUrl: './carousel-date.component.html',
  styleUrls: ['./carousel-date.component.scss'],
})
export class CarouselDateComponent implements OnInit, OnDestroy {
  @Input() isFly: string;

  @ViewChildren(FlightDetailsComponent) el: QueryList<FlightDetailsComponent>;

  @ViewChild(EditOptionsComponent) edit: EditOptionsComponent;

  event: Event;
  $event: MouseEvent;
  oneWay: number;
  isCanFly: boolean;
  isOneWay: boolean;
  isTo: boolean;
  isFlightDay: boolean;
  i: number;
  index: number;

  type: number;

  state$: Observable<AppState>;
  state: AppState;
  private subscriptions = new Subscription();

  // slider
  slides: Array<string | undefined>;
  slidesFrom: Array<string | undefined>;
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
  endDate: string | undefined;
  currency: string | undefined;
  //price: number;
  //priceFrom: number;
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
  numberOfPassengersFrom: IAgeTypeQuantity[];
  passengersFrom: IAgeTypeQuantity[];
  totalAmount: { adultPrice: number; childPrice: number; infantPrice: number; sumPrice: number; totalTax?: number | undefined; };
  totalAmountFrom: { adultPrice: number; childPrice: number; infantPrice: number; sumPrice: number; totalTax?: number | undefined; };
  isPaid = false;

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
  arrivingTimeTo: string;
  arrivingTimeFrom: string;
  select: HTMLButtonElement[];
  attributes: NamedNodeMap;


  constructor(
    private store: Store<AppState>,
    private aviaService: AviaService,
    public dateService: DateService,
    public sumPriceService: SumPriceService,
    private elRef: ElementRef
  ) {

  }

  public getDetailsList(from: string, to: string): Observable<IFlight[]> {
    this.details$ = this.aviaService.getAllFlights();
    this.subscriptions.add(
      this.details$.subscribe((value) => {
        for (let i = 0; i < value.length; i++) {
          const result = value.filter(
            (item) =>
              item.originAirportIataCode === from.toString().trim() &&
              item.destinationAirportIataCode === to.toString().trim()
          );
          this.result = result;
        }
        if (this.result !== undefined && this.result.length > 0)
          this.prices = this.result[0].pricesAdult;
        this.seats = this.result[0].totalSeats;
        this.departureTime = this.result[0].departureTime;
        this.direct = this.result[0].direct;
        this.flightNumber = this.result[0].flightNumber;
        this.duration = this.result[0].duration;
        this.returnFlightId = this.result[0].returnFlightId;
        if (this.isOneWay === false) {
          this.getReturnDetailsList(this.returnFlightId);
        }
        this.flightDaysTo = this.result[0].flightDays;
        this.index = this.dateService.getIndexOfDate(this.startDate, this.flightDaysTo);
        this.totalAmount = this.sumPriceService.sumpPrices(
          this.result[0],
          this.numberOfPassengers,
          this.index);
        this.arrivingTimeTo = this.dateService.getArrivingDate(this.startDate, this.departureTime, this.duration).timeToRender;
        this.store.dispatch(SelectActions.setSelectedOutboundFlightNo({ outboundFlightNo: this.flightNumber }));
        this.store.dispatch(SelectActions.setSelectedTotalAmount({ totalAmount: this.totalAmount }));
        this.store.dispatch(SelectActions.setTotalCalculatedAmount({ totalCalculatedAmount: this.totalAmount.sumPrice + (this.totalAmount.totalTax || 0) }));
        this.store.dispatch(SelectActions.setSelectedTripDuration({ duration: this.duration }));
        this.store.dispatch(SelectActions.setSelectedOutboundDepartureTime({ outboundDepartureTime: this.departureTime }));
        this.store.dispatch(SelectActions.setSelectedTripSeatsTo({ seatsTo: this.seats }));
        this.store.dispatch(SelectActions.setSelectedFlightDaysTo({ flightDaysTo: this.flightDaysTo }));
        this.store.dispatch(SelectActions.setSelectedOutboundDepartureTime({ outboundDepartureTime: this.departureTime }));
        this.store.dispatch(SelectActions.setSelectedFlightDaysTo({ flightDaysTo: this.flightDaysTo })
        );
        this.store.dispatch(SelectActions.setSelectedPricesTo({ pricesTo: this.prices }));
        this.store.dispatch(SelectActions.setSelectedOutboundArrivalTime({ outboundArrivalTime: this.arrivingTimeTo }));

      }));
    return this.details$;
  }

  public getReturnDetailsList(id: string): Observable<IFlight[]> {
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
          this.pricesFrom = this.returnDetails[0].pricesAdult;
        this.flightNumberFrom = this.returnDetails[0].flightNumber;
        this.seatsFrom = this.returnDetails[0].totalSeats;
        this.departureTimeFrom = this.returnDetails[0].departureTime;
        this.directFrom = this.returnDetails[0].direct;
        this.flightNumberFrom = this.returnDetails[0].flightNumber;
        this.durationFrom = this.returnDetails[0].duration;
        this.flightDaysFrom = this.returnDetails[0].flightDays;
        this.arrivingTimeFrom = this.dateService.getArrivingDate(this.endDate, this.departureTimeFrom, this.durationFrom).timeToRender;
        if (this.endDate !== undefined) {
          const index = this.dateService.getIndexOfDate(this.endDate, this.flightDaysFrom);
          this.totalAmountFrom = this.sumPriceService.sumpPrices(
            this.returnDetails[0],
            this.numberOfPassengers,
            index);
          this.store.dispatch(SelectActions.setSelectedTotalAmountFrom({ totalAmountFrom: this.totalAmountFrom }));
        }
        this.store.dispatch(SelectActions.setSelectedReturnFlightNo({ returnFlightNo: this.flightNumberFrom }));
        this.store.dispatch(SelectActions.setTotalCalculatedAmount({ totalCalculatedAmount: (this.totalAmount.sumPrice || 0) + (this.totalAmount.totalTax || 0) + (this.totalAmountFrom.sumPrice || 0) + (this.totalAmountFrom.totalTax || 0) }));
        this.store.dispatch(SelectActions.setSelectedTripDurationFrom({ durationFrom: this.durationFrom }));
        this.store.dispatch(SelectActions.setSelectedReturnDepartureTime({ returnDepartureTime: this.departureTimeFrom }));
        this.store.dispatch(SelectActions.setSelectedTripSeatsFrom({ seatsFrom: this.seatsFrom }));
        this.store.dispatch(SelectActions.setSelectedFlightDaysFrom({ flightDaysFrom: this.flightDaysFrom }));
        this.store.dispatch(SelectActions.setSelectedPricesFrom({ pricesFrom: this.pricesFrom }));
        this.store.dispatch(SelectActions.setSelectedReturnArrivalTime({ returnArrivalTime: this.arrivingTimeFrom }));
      }
      ));
    return this.returnDetails$;
  }

  public getTripState() {
    this.state$ = this.store.select((appState) => appState);
    this.subscriptions.add(
      this.state$.subscribe((state: AppState) => {
        this.codFrom = state.trip.airportsIataCodeOrigin;
        this.codTo = state.trip.airportsIataCodeDestination;
        this.cityFrom = state.trip.originCity;
        this.cityTo = state.trip.destinationCity;
        this.from = state.trip.originAiroportName;
        this.to = state.trip.destinationAiroportName;
        this.startDate = state.trip.outboundDepartureDate
        this.slides = this.dateService.dateSlideTo(this.startDate);
        if (state.trip.returnDepartureDate !== undefined && state.trip.returnDepartureDate !== '') {
          this.endDate = state.trip.returnDepartureDate;
          this.slidesFrom = this.dateService.dateSlideTo(this.endDate);
        }
        if (state.trip.outboundDepartureTime !== undefined && state.trip.outboundDepartureTime !== '')
          this.departureTime = state.trip.outboundDepartureTime;
        if (state.trip.returnDepartureTime !== undefined && state.trip.returnDepartureTime !== '')
          this.departureTimeFrom = state.trip.returnDepartureTime;
        this.numberOfPassengers = state.trip.numberOfPassengers;
        this.currency = getSymbolFromCurrency(state.user.currency);
        this.isOneWay = state.trip.roundTrip === true ? false : true;
        this.oneWay = state.trip.roundTrip === false ? 1 : 0;
        this.dateFormat = state.user.dateFormat;
        this.flightNumber = state.trip.outboundFlightNo;
        if (state.trip.returnFlightNo !== undefined && state.trip.returnFlightNo !== '')
          this.flightNumberFrom = state.trip.returnFlightNo
        if (state.trip.duration !== undefined && state.trip.duration !== 0)
          this.duration = state.trip.duration;
        if (state.trip.durationFrom !== undefined && state.trip.durationFrom !== 0)
          this.durationFrom = state.trip.durationFrom;
        if (state.trip.seatsTo !== undefined && state.trip.seatsTo !== 0)
          this.seats = state.trip.seatsTo;
        if (state.trip.seatsFrom !== undefined && state.trip.seatsFrom !== 0)
          this.seatsFrom = state.trip.seatsFrom;
        if (state.trip.flightDaysTo !== undefined && state.trip.flightDaysTo.length > 0)
          this.flightDaysTo = state.trip.flightDaysTo;
        if (state.trip.flightDaysFrom !== undefined && state.trip.flightDaysFrom.length > 0)
          this.flightDaysFrom = state.trip.flightDaysFrom;
        if (state.trip.pricesTo !== undefined && state.trip.pricesTo.length > 0)
          this.prices = state.trip.pricesTo;
        if (state.trip.pricesFrom !== undefined && state.trip.pricesFrom.length > 0)
          this.pricesFrom = state.trip.pricesFrom;
      }
      ));

  }

  ngOnInit() {
    this.getTripState();
    this.getDetailsList(this.codFrom, this.codTo);
    this.timeZoneFrom = this.dateService.findOffset(this.cityFrom);
    this.timeZoneTo = this.dateService.findOffset(this.cityTo);
    this.isCanFly = this.dateService.isCanFly(this.startDate);
    this.isFly = this.isCanFly ? 'true' : 'false';
    this.slides = this.dateService.dateSlideTo(this.startDate);
    this.slidesFrom = this.dateService.dateSlideTo(this.endDate);
    this.select = this.elRef.nativeElement.querySelectorAll('.select');
  }

  onClick(e: Event) {
    const element = e.target as HTMLElement;
    const children = element.children;
    const slides = this.elRef.nativeElement.querySelectorAll('.slide');
    const slidesFrom = this.elRef.nativeElement.querySelectorAll('.slide-from');
    if (element.dataset['index'] === '1' && element.classList.contains('slide')) {
      element.classList.add('large');
      for (let i = 0; i < slides.length; i++) {
        if (slides[i].classList.contains('large') &&
          slides[i] !== element &&
          slides[i].dataset['index'] === '1')
          slides[i].classList.remove('large');
        slides[i].children[0].children[0].classList.remove('big-date');
        slides[i].children[0].children[1].classList.remove('big-weekday');
        slides[i].children[0].children[2].classList.remove('big-price');
      }
      children[0].children[0].classList.add('big-date');
      children[0].children[1].classList.add('big-weekday');
      children[0].children[2].classList.add('big-price');
      this.startDate = element.id;
      this.slides = this.dateService.dateSlideTo(this.startDate);
      this.isCanFly = this.dateService.isCanFly(this.startDate);
      this.isFly = this.isCanFly ? 'true' : 'false';
      const index = this.dateService.getIndexOfDate(this.startDate, this.flightDaysTo);
      if (index !== undefined && this.result !== undefined && this.result.length > 0)
        this.totalAmount = this.sumPriceService.sumpPrices(this.result[0], this.numberOfPassengers, index);
      this.store.dispatch(SelectActions.setSelectedDepartureDate({ outboundDepartureDate: this.startDate }));
      this.store.dispatch(SelectActions.setSelectedTotalAmount({ totalAmount: this.totalAmount }));
      if (this.isOneWay === false) {
        this.store.dispatch(SelectActions.setTotalCalculatedAmount({
          totalCalculatedAmount:
            (this.totalAmount.sumPrice || 0) +
            (this.totalAmount.totalTax || 0) +
            (this.totalAmountFrom.sumPrice || 0) +
            (this.totalAmountFrom.totalTax || 0)
        }));
      }

    }
    if (this.isOneWay === true) {
      this.store.dispatch(SelectActions.setTotalCalculatedAmount({
        totalCalculatedAmount:
          (this.totalAmount.sumPrice || 0) + (this.totalAmount.totalTax || 0)
      }));
    }
    if (element.dataset['index'] === '2' && element.classList.contains('slide')) {
      element.classList.add('large');
      for (let i = 0; i < slidesFrom.length; i++) {
        if (
          slidesFrom[i].classList.contains('large') &&
          slidesFrom[i] !== element &&
          slidesFrom[i].dataset['index'] === '2')
          slidesFrom[i].classList.remove('large');
        slidesFrom[i].children[0].children[0].classList.remove('big-date');
        slidesFrom[i].children[0].children[1].classList.remove('big-weekday');
        slidesFrom[i].children[0].children[2].classList.remove('big-price');
      }
      children[0].children[0].classList.add('big-date');
      children[0].children[1].classList.add('big-weekday');
      children[0].children[2].classList.add('big-price');
      this.endDate = element.id;
      this.slidesFrom = this.dateService.dateSlideTo(this.endDate);
      this.isCanFly = this.dateService.isCanFly(this.endDate);
      this.isFly = this.isCanFly ? 'true' : 'false';
      const index = this.dateService.getIndexOfDate(this.endDate, this.flightDaysTo);
      if (index !== undefined && this.returnDetails !== undefined && this.returnDetails.length > 0)
        this.totalAmountFrom = this.sumPriceService.sumpPrices(this.returnDetails[0], this.numberOfPassengers, index);
      this.store.dispatch(SelectActions.setSelectedReturnDate({ returnDepartureDate: this.endDate }));
      this.store.dispatch(SelectActions.setSelectedTotalAmountFrom({ totalAmountFrom: this.totalAmountFrom }));
      this.store.dispatch(SelectActions.setTotalCalculatedAmount({
        totalCalculatedAmount:
          (this.totalAmount.sumPrice || 0) +
          (this.totalAmount.totalTax || 0) +
          (this.totalAmountFrom.sumPrice || 0) +
          (this.totalAmountFrom.totalTax || 0)
      }));

    }
  }

  enableEditButton(to: string, from: string) {
    if (from !== undefined &&
      to !== undefined &&
      from !== '' &&
      to !== '' &&
      from !== to &&
      to !== from
    ) {
      return true;
    }

    return false;
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
