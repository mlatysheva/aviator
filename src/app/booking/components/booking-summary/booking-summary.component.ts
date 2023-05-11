import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IPassenger } from 'backend/types';
import { map, Observable } from 'rxjs';

import { AppState } from 'src/app/store/state.models';
import { ITrip } from 'src/app/models/trip';
import { selectTheTrip } from 'src/app/store/selectors/trip.selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.scss'],
})
export class BookingSummaryComponent implements OnInit {
  public trip$!: Observable<ITrip>;
  public trip: ITrip;

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit() {
    this.trip$ = this.store.select(selectTheTrip);
    this.trip$.pipe(map((trip) => (this.trip = trip))).subscribe();
  }

  public onBackClick() {
    this.router.navigate(['passengers']);
  }

  public onBuyClick() {
    this.router.navigate(['cart']);
  }
}
