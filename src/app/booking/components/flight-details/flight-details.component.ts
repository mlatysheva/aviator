import { Component, Input, ElementRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DateService } from '../../services/date.service';
import {
  clearSelectedTrip,
  setSelectedTrip,
} from 'src/app/store/actions/select.actions';
import { AppState } from 'src/app/store/state.models';
import { IAgeTypeQuantity } from '../../../models/agetype-quantity.model';
import { SumPriceService } from '../../services/sum-price.service';

@Component({
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.scss'],
})
export class FlightDetailsComponent implements OnInit {
  @Input() isFly: string;
  @Input() from: string;
  @Input() to: string;
  @Input() startDate: string;
  @Input() currency: string;
  @Input() index: number;
  @Input() prices: number[] = [];
  @Input() price: number;
  @Input() seats: number;
  @Input() hours: number;
  @Input() minutes: number;
  @Input() timeZoneFrom: string | undefined;
  @Input() timeZoneTo: string | undefined;
  @Input() departureTime: string;
  @Input() arrivingDateTo: string | undefined;
  @Input() flightNumber: string;
  @Input() isCanFly: boolean;
  @Input() isFlightDay: boolean;
  @Input() i: number;
  @Input() isTo: boolean;
  @Input() oneWay: number;
  @Input() onClick: (e: MouseEvent) => void;
  @Input() cityFrom: string;
  @Input() cityTo: string;
  @Input() codFrom: string;
  @Input() codTo: string;
  @Input() flightNumberFrom: string;
  @Input() endDate: string;
  @Input() departureTimeFrom: string;
  @Input() arrivingDateFrom: string;
  @Input() numberOfPassengersWithPrices: IAgeTypeQuantity[];
  @Input() totalAmount: number;
  @Input() totalTax: number;
  @Input() type: number;
  @Input() flightDaysTo: number[];
  classTo = '';
  classFrom = '';

  constructor(
    public dateService: DateService,
    private el: ElementRef,
    private store: Store<AppState>,
    private sumPriceService: SumPriceService
  ) {}

  ngOnInit(): void {
    this.sumPriceService.passengersWithFareAndTax$.subscribe(
      (passengers) => (this.numberOfPassengersWithPrices = passengers)
    );
  }

  onEditFlight(e: Event) {
    e.preventDefault();
    const element = this.el.nativeElement.querySelectorAll('.seats');
    const button = this.el.nativeElement.querySelectorAll('.select');
    const editButton = this.el.nativeElement.querySelectorAll('.edit-btn');
    if (this.type === 1) {
      element[0].classList.remove('none');
      button[0].classList.remove('none');
      editButton[0].classList.add('none');
      this.classTo = '';
      this.store.dispatch(clearSelectedTrip());
    }
    if (this.type === 2) {
      element[0].classList.remove('none');
      button[0].classList.remove('none');
      editButton[0].classList.add('none');
      this.classFrom = '';
    }
  }

  onSelectFlight(e: Event) {
    e.preventDefault();
    const element = this.el.nativeElement.querySelectorAll('.seats');
    const button = this.el.nativeElement.querySelectorAll('.select');
    const editButton = this.el.nativeElement.querySelectorAll('.edit-btn');
    if (this.type === 1) {
      element[0].classList.add('none');
      button[0].classList.add('none');
      editButton[0].classList.remove('none');
      this.classTo = 'none';
      this.store.dispatch(
        setSelectedTrip({
          roundTrip: true,
          originCity: this.cityFrom,
          destinationCity: this.cityTo,
          outboundFlightNo: this.flightNumber,
          airportsIataCodes: [this.codFrom, this.codTo],
          outboundDepartureDate: this.startDate,
          outboundDepartureTime: this.departureTime,
          outboundArrivalTime: this.arrivingDateTo ? this.arrivingDateTo : '',
          returnFlightNo: this.flightNumberFrom,
          returnDepartureDate: this.endDate,
          returnDepartureTime: this.departureTimeFrom,
          returnArrivalTime: this.arrivingDateFrom ? this.arrivingDateFrom : '',
          numberOfPassengers: this.numberOfPassengersWithPrices,
          totalAmount: this.totalAmount,
          totalTax: this.totalTax,
        })
      );
    }
    if (this.type === 2) {
      element[0].classList.add('none');
      button[0].classList.add('none');
      editButton[0].classList.remove('none');
      this.classFrom = 'none';
    }
  }
}
