import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/state.models';
import { AviaService } from '../../../avia/services/avia.service';
import { IFlight } from '../../../models/flight';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-carousel-date',
  templateUrl: './carousel-date.component.html',
  styleUrls: ['./carousel-date.component.scss'],
})
export class CarouselDateComponent implements OnInit {
  isCanFly: boolean;
  state$: Observable<AppState>;
  state: AppState;
  from: string;
  to: string;
  codFrom: string;
  codTo: string;
  cityFrom: string;
  cityTo: string;
  startDate: string;
  endDate: string;
  currency: string;
  // slider
  slides: Array<string>;
  slidesFrom: Array<string>;
  itemsPerSlide = 5;
  singleSlideOffset = true;

  price: number;
  details$: Observable<IFlight[]>;
  flightDetail: IFlight | undefined;
  details: IFlight[] = [];
  result: IFlight[] = [];
  seats: number;

  //time
  hours: number;
  minutes: number;
  timeZoneFrom: string | undefined;
  timeZoneTo: string | undefined;
  departureTime: string;
  arrivingDateTo: string;
  arrivingDateFrom: string;

  direct: boolean;
  flightNumber: string;
  duration: number;

  constructor(
    private store: Store<AppState>,
    private aviaService: AviaService,
    public dateService: DateService
  ) { }

  public getDetailsList(from: string, to: string): Observable<IFlight[]> {
    this.details$ = this.aviaService.getAllFlights();
    this.details$.subscribe((value) => {
      for (let i = 0; i < value.length; i++) {
        this.details.push(value[i]);
        const result = this.details.filter(
          (item) =>
            item.originAirportIataCode === from.toString().trim() &&
            item.destinationAirportIataCode === to.toString().trim())
        this.result = result;
      }
      // Maria changed priceAdult to pricesAdult[0]
      this.price = this.result[0].pricesAdult[0];
      this.seats = this.result[0].totalSeats;
      this.departureTime = this.result[0].departureTime;
      this.direct = this.result[0].direct;
      this.flightNumber = this.result[0].flightNumber;
      this.duration = this.result[0].duration;
      this.hours = this.dateService.getHours(this.duration);
      this.minutes = this.dateService.getMinutes(this.duration);
      this.arrivingDateTo = this.dateService.getArrivingDate(this.startDate, this.duration);
      this.arrivingDateFrom = this.dateService.getArrivingDate(this.endDate, this.duration);
    }

    );
    return this.details$;
  }

  ngOnInit() {
    this.state$ = this.store.select((appState) => appState);
    this.state$.subscribe((state: AppState) => {
      this.from = state.search.departure.split(',').slice(0, 2).join('');
      this.cityFrom = state.search.departure.split(',').slice(1, 2).join('').trim();
      this.cityTo = state.search.destination.split(',').slice(1, 2).join('').trim();
      this.to = state.search.destination.split(',').slice(0, 2).join('');
      this.codFrom = state.search.departure.split(',').slice(2, 3).join('');
      this.codTo = state.search.destination.split(',').slice(2, 3).join('');
      this.startDate = state.search.startDate;
      this.endDate = state.search.endDate;
      this.slides = this.dateService.dateSlideTo(this.startDate);
      this.slidesFrom = this.dateService.dateSlideTo(this.endDate);
      this.currency = state.user.currency;
      this.getDetailsList(this.codFrom, this.codTo);
      this.isCanFly = this.dateService.isCanFly(this.startDate);
      this.timeZoneFrom = this.dateService.findOffset(this.cityFrom);
      this.timeZoneTo = this.dateService.findOffset(this.cityTo);
    }
    );
  }
}
