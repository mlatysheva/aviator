import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/state.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-second-menu',
  templateUrl: './second-menu.component.html',
  styleUrls: ['./second-menu.component.scss'],
})
export class SecondMenuComponent implements OnInit {
  from: string;
  to: string;
  startDate: string;
  endDate: string | undefined;
  people: number;
  state$: Observable<AppState>;
  state: AppState;

  onClick() {
    this.from === this.from ? (this.from = this.to) : this.from;
    this.to === this.to ? (this.to = this.from) : this.to;
  }

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.state$ = this.store.select((appState) => appState);
    this.state$.subscribe((state: AppState) => {
      this.from = state.trip.originCity + ', ' + state.trip.airportsIataCodes[0];
      this.to = state.trip.destinationCity + ', ' + state.trip.airportsIataCodes[1];
      this.startDate = state.trip.outboundDepartureDate;
      this.endDate = state.trip.returnDepartureDate;
      this.people = state.trip.numberOfPassengers[0]?.quantity +
        state.trip.numberOfPassengers[1]?.quantity +
        state.trip.numberOfPassengers[2]?.quantity;
    });
  }
}
