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
  numberOfPassengersFrom: IAgeTypeQuantity[];
  passengersFrom: IAgeTypeQuantity[];
  totalAmount: { adultPrice: number; childPrice: number; infantPrice: number; sumPrice: number; totalTax?: number | undefined; };
  totalAmountFrom: { adultPrice: number; childPrice: number; infantPrice: number; sumPrice: number; totalTax?: number | undefined; };


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

  constructor(
    private store: Store<AppState>,
    private aviaService: AviaService,
    public dateService: DateService,
    public sumPriceService: SumPriceService,
    private elRef: ElementRef
  ) { }

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
        this.hours = this.dateService.getHours(this.duration);
        this.minutes = this.dateService.getMinutes(this.duration);
        this.arrivingDateTo = this.dateService.getArrivingDate(
          this.startDate,
          this.departureTime,
          this.duration,
        ).dateToRender;
        this.arrivingTimeTo = this.dateService.getArrivingDate(
          this.startDate,
          this.departureTime,
          this.duration,
        ).timeToRender;
        this.returnFlightId = this.result[0].returnFlightId;
        this.getReturnDetailsList(this.returnFlightId);
        this.flightDaysTo = this.result[0].flightDays;
        this.index = this.dateService.getIndexOfDate(this.startDate, this.flightDaysTo);
        this.totalAmount = this.sumPriceService.sumpPrices(
          this.result[0],
          this.numberOfPassengers,
          this.index);
        this.store.dispatch(SelectActions.setSelectedOutboundFlightNo({ outboundFlightNo: this.flightNumber }));
        this.store.dispatch(SelectActions.setSelectedTotalAmount({ totalAmount: this.totalAmount }));
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
          this.priceFrom = this.returnDetails[0].pricesAdult[0];
        this.pricesFrom = this.returnDetails[0].pricesAdult;
        this.seatsFrom = this.returnDetails[0].totalSeats;
        this.departureTimeFrom = this.returnDetails[0].departureTime;
        this.directFrom = this.returnDetails[0].direct;
        this.flightNumberFrom = this.returnDetails[0].flightNumber;
        this.durationFrom = this.returnDetails[0].duration;
        this.hoursFrom = this.dateService.getHours(this.durationFrom);
        this.minutesFrom = this.dateService.getMinutes(this.durationFrom);
        this.arrivingDateFrom = this.dateService.getArrivingDate(this.endDate, this.departureTimeFrom, this.durationFrom).dateToRender;
        this.arrivingTimeFrom = this.dateService.getArrivingDate(
          this.endDate, this.departureTimeFrom, this.durationFrom
        ).timeToRender;
        this.flightDaysFrom = this.returnDetails[0].flightDays;
        if (this.endDate !== undefined) {
          const index = this.dateService.getIndexOfDate(this.endDate, this.flightDaysFrom);

          this.totalAmountFrom = this.sumPriceService.sumpPrices(
            this.returnDetails[0],
            this.numberOfPassengers,
            index);

          this.store.dispatch(SelectActions.setSelectedTotalAmountFrom({ totalAmountFrom: this.totalAmountFrom }));
        }
        this.store.dispatch(SelectActions.setSelectedReturnFlightNo({ returnFlightNo: this.flightNumberFrom }));
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
        this.startDate = state.trip.outboundDepartureDate;
        this.endDate = state.trip.returnDepartureDate;
        this.numberOfPassengers = state.trip.numberOfPassengers;
        this.currency = getSymbolFromCurrency(state.user.currency);
        this.isOneWay = state.trip.roundTrip === true ? false : true;
        this.oneWay = state.trip.roundTrip === false ? 1 : 0;
        this.slides = this.dateService.dateSlideTo(this.startDate);
        this.slidesFrom = this.dateService.dateSlideTo(this.endDate);
        this.dateFormat = state.user.dateFormat;
        this.flightNumber = state.trip.outboundFlightNo;
        //this.flightNumberFrom = state.trip.returnFlightNo;
        this.totalAmount = state.trip.totalAmount;
        //this.totalAmountFrom = state.trip.totalAmountFrom;
        this.isCanFly = this.dateService.isCanFly(this.startDate);
        this.isFly = this.isCanFly ? 'true' : 'false';
        //this.timeZoneFrom = this.dateService.findOffset(this.cityFrom);
        //this.timeZoneTo = this.dateService.findOffset(this.cityTo);

      }
      ));
  }

  ngOnInit() {
    this.getTripState();
    this.getDetailsList(this.codFrom, this.codTo);
    this.isCanFly = this.dateService.isCanFly(this.startDate);
    this.addStyleToChoosenDate(this.startDate);
    this.isFly = this.isCanFly ? 'true' : 'false';
    this.timeZoneFrom = this.dateService.findOffset(this.cityFrom);
    this.timeZoneTo = this.dateService.findOffset(this.cityTo);
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
      this.arrivingDateTo = this.dateService.getArrivingDate(this.startDate, this.departureTime, this.duration).dateToRender;
      this.arrivingTimeTo = this.dateService.getArrivingDate(
        this.startDate,
        this.departureTime,
        this.duration,
      ).timeToRender;
      this.slides = this.dateService.dateSlideTo(this.startDate);
      this.isCanFly = this.dateService.isCanFly(this.startDate);
      this.isFly = this.isCanFly ? 'true' : 'false';
      const index = this.dateService.getIndexOfDate(this.startDate, this.flightDaysTo);
      if (index !== undefined && this.result !== undefined && this.result.length > 0)
        this.totalAmount = this.sumPriceService.sumpPrices(this.result[0], this.numberOfPassengers, index);
      this.store.dispatch(SelectActions.setSelectedDepartureDate({ outboundDepartureDate: this.startDate }));
      this.store.dispatch(SelectActions.setSelectedTotalAmount({ totalAmount: this.totalAmount }));
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
      this.arrivingDateFrom = this.dateService.getArrivingDate(this.endDate, this.departureTimeFrom, this.duration).dateToRender;
      this.arrivingTimeFrom = this.dateService.getArrivingDate(
        this.endDate, this.departureTimeFrom, this.duration
      ).timeToRender;
      this.slidesFrom = this.dateService.dateSlideTo(this.endDate);
      this.isCanFly = this.dateService.isCanFly(this.endDate);
      this.isFly = this.isCanFly ? 'true' : 'false';
      const index = this.dateService.getIndexOfDate(this.endDate, this.flightDaysTo);
      if (index !== undefined && this.returnDetails !== undefined && this.returnDetails.length > 0)
        this.totalAmountFrom = this.sumPriceService.sumpPrices(this.returnDetails[0], this.numberOfPassengers, index);
      this.store.dispatch(SelectActions.setSelectedReturnDate({ returnDepartureDate: this.endDate }));
      this.store.dispatch(SelectActions.setSelectedTotalAmountFrom({ totalAmountFrom: this.totalAmountFrom }));

    }
  }

  addStyleToChoosenDate(date: string) {
    const choosenSlide = this.elRef.nativeElement.querySelectorAll('.slide');
    console.log(date, choosenSlide);
    for (let i = 0; i < choosenSlide.length; i++) {
      if (choosenSlide[i].id === date) {

        choosenSlide[i].classList.add('large');
        choosenSlide[i].children[0].children[0].classList.add('big-date');
        choosenSlide[i].children[0].children[1].classList.add('big-weekday');
        choosenSlide[i].children[0].children[2].classList.add('big-price');
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
