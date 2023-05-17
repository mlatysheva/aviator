import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';

import { AppState } from '../../../store/state.models';
import { ITrip } from '../../../models/trip';
import { selectTrip } from '../../../store/selectors/trip.selectors';
import { Router } from '@angular/router';
import { CartApiService } from '../../../cart/services/cart-api.service';
import { ICart } from '../../../models/cart';
import { TripState } from 'src/app/store/reducers/trip.reducer';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.scss'],
})
export class BookingSummaryComponent implements OnInit {
  public trip$!: Observable<TripState>;
  public trip: TripState;
  public trips: ITrip[];

  public cart$!: Observable<any>;
  public cart: ICart;

  public tripIds: string[];
  public taxRate: number;

  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {}


  ngOnInit() {
    this.trip$ = this.store.select(selectTrip);
    this.trip$.pipe(map((trip) => (this.trip = trip))).subscribe();
    this.taxRate = 0.15;
  }

  public onBackClick() {
    this.router.navigate(['passengers']);
  }

  public onBuyClick() {
    if (this.trips.length) {
      this.router.navigate(['cart']);
    }
  }
}
