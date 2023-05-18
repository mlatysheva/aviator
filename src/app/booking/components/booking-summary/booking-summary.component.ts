import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription } from 'rxjs';

import { AppState } from '../../../store/state.models';
import { ITrip } from '../../../models/trip';
import { selectTrip } from '../../../store/selectors/trip.selectors';
import { Router } from '@angular/router';
import { ICart } from '../../../models/cart';
import { TripState } from 'src/app/store/reducers/trip.reducer';
import { AviaService } from 'src/app/avia/services/avia.service';
import { ProgressBarService } from 'src/app/core/services/progress-bar.service';
import { progressBar } from '../../../constants/progressBar';
import { TRIP_ID } from '../../../constants/localStorage';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.scss'],
})
export class BookingSummaryComponent implements OnInit, OnDestroy {
  public trip$!: Observable<TripState>;
  public trip: TripState;
  public trips: ITrip[];

  public cart$!: Observable<any>;
  public cart: ICart;

  public tripIds: string[];
  public taxRate: number;

  private subscriptions = new Subscription();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private aviaService: AviaService,
    private progressBarService: ProgressBarService
  ) {}

  ngOnInit() {
    this.trip$ = this.store.select(selectTrip);
    this.subscriptions.add(
      this.trip$.pipe(map((trip) => (this.trip = trip))).subscribe()
    );
    this.taxRate = 0.15;
  }

  public onBackClick() {
    this.progressBarService.progressBar$.next(progressBar.PASSENGERS);
    this.router.navigate(['passengers']);
  }

  public onBuyClick() {
    this.aviaService.changeHeaderStyle$.next(false);
    localStorage.removeItem(TRIP_ID);
    this.router.navigate(['cart']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
