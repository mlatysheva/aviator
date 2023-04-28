import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/state.models';
import { AviaService } from '../../../avia/services/avia.service';
import { IFlight } from '../../../models/flight';

@Component({
  selector: 'app-carousel-date',
  templateUrl: './carousel-date.component.html',
  styleUrls: ['./carousel-date.component.scss']
})
export class CarouselDateComponent implements OnInit {

  state$: Observable<AppState>;
  state: AppState;
  from: string;
  to: string;
  codFrom: string;
  codTo: string;
  startDate: string;
  endDate: string;
  people: number;
  currency: string;
  slides: Array<string>;
  itemsPerSlide = 5;
  singleSlideOffset = true;
  price: number;
  prices$: Observable<IFlight[]>;
  filter1: string;
  filter2: string;


  addOneDay(date: string) {
    const dateCopy = new Date(date);
    dateCopy.setDate(dateCopy.getDate() + 1);
    return dateCopy.toString();
  }

  minusOneDay(date: string) {
    const dateCopy = new Date(date);
    dateCopy.setDate(dateCopy.getDate() - 1);
    return dateCopy.toString();
  }

  isCanFly(date: string) {
    const dateCopy = new Date(date);
    const today = new Date();
    return dateCopy < today;
  }

  constructor(
    private store: Store<AppState>,
    private aviaService: AviaService,
  ) {
  }

  public getPricesList(from: string, to: string): Observable<IFlight[]> {
    this.prices$ = this.aviaService.getAllFlights();
    this.prices$.subscribe((flights) => {
      return (flights.filter((flight) => {
        return flight.originAirportIataCode === from && flight.destinationAirportIataCode === to;
      }
      ));
    });
    return this.prices$;
  }

  ngOnInit() {
    this.state$ = this.store.select(appState => appState);
    this.state$.subscribe((state: AppState) => {
      this.from = state.search.departure.split(',').slice(0, 2).join('');
      this.to = state.search.destination.split(',').slice(0, 2).join('');
      this.codFrom = state.search.departure.split(',').slice(2, 3).join('');
      this.codTo = state.search.destination.split(',').slice(2, 3).join('');
      this.startDate = state.search.startDate;
      this.endDate = state.search.endDate;
      this.slides = [this.minusOneDay(this.startDate), this.startDate, this.addOneDay(this.startDate)];
      this.currency = state.user.currency;
      this.getPricesList(this.codFrom, this.codTo).subscribe((flight) => {
        flight.filter((flight) => {
          if (flight.originAirportIataCode === this.codFrom && flight.destinationAirportIataCode === this.codTo) {
            this.price = flight.priceAdult;
          }
          return flight;
        });

      });

    });
  }
}