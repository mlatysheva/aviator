import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';

import { AppState } from '../../../store/state.models';
import { ITrip } from '../../../models/trip';
import { selectTheTrip } from '../../../store/selectors/trip.selectors';
import { Router } from '@angular/router';
import { CartApiService } from '../../../cart/services/cart-api.service';
import { ICart } from '../../../models/cart';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.scss'],
})
export class BookingSummaryComponent implements OnInit {
  public trip$!: Observable<ITrip>;
  public trip: ITrip;
  public trips: ITrip[];

  public cart$!: Observable<any>;
  public cart: ICart;

  public tripIds: string[];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private cartApiService: CartApiService
  ) {}

  ngOnInit() {
    this.trip$ = this.store.select(selectTheTrip);
    this.trip$.pipe(map((trip) => (this.trip = trip))).subscribe();
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
