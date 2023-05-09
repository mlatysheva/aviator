import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IPassenger } from 'backend/types';
import { map, Observable } from 'rxjs';
import { selectAllPassengers } from 'src/app/store/selectors/trip.selectors';
import { selectTrip } from 'src/app/store/selectors/search.selectors';
import { AppState } from 'src/app/store/state.models';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.scss'],
})
export class BookingSummaryComponent implements OnInit {
  public passengers$!: Observable<IPassenger[] | any>;
  public tripType$!: Observable<string>;
  public tripType: string;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.passengers$ = this.store.select(selectAllPassengers);
    this.tripType$ = this.store.select(selectTrip);
    this.tripType$
      .pipe(map((tripType) => (this.tripType = tripType)))
      .subscribe();
  }
}
