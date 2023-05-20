import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/state.models';
import { TRIP_ID, USER_ID } from '../../../constants/localStorage';
import { progressBar } from '../../../constants/progressBar';
import { ProgressBarService } from '../../../core/services/progress-bar.service';
import { CartApiService } from '../../../cart/services/cart-api.service';
import { ITrip } from '../../../models';
import { EMPTY, switchMap, take, tap } from 'rxjs';
import { selectTrip } from '../../../store/selectors/trip.selectors';
import * as SelectActions from '../../../store/actions/select.actions';
import { setUserId, setTripId } from '../../../store/actions/trip.actions';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss'],
})
export class BookingPageComponent {
  tripData: ITrip;

  constructor(
    private router: Router,
    private progressBarService: ProgressBarService,
    private store: Store<AppState>,
    private cartService: CartApiService
  ) {}

  onBackClick() {
    this.store.dispatch(SelectActions.clearSelectedTrip());
    this.router.navigate(['main']);
  }

  onNextClick() {
    this.progressBarService.progressBar$.next(progressBar.PASSENGERS);

    const tripId = localStorage.getItem(TRIP_ID);
    const userId = localStorage.getItem(USER_ID);

    const trip$ = this.store.select(selectTrip);
    trip$
      .pipe(
        take(1),
        tap((trip) => {
          if (userId && !tripId) {
            const updatedTrip = {
              ...trip,
              userId: JSON.parse(JSON.stringify(userId)),
            };
            this.cartService
              .addTrip(updatedTrip)
              .pipe(
                tap((newTrip) => {
                  if (newTrip.id) {
                    localStorage.setItem(TRIP_ID, newTrip.id);
                    this.cartService
                      .addTripIdToUser(userId, newTrip.id)
                      .subscribe();
                    this.store.dispatch(
                      setTripId({ id: localStorage.getItem(TRIP_ID) || '' })
                    );
                    this.store.dispatch(
                      setUserId({ userId: localStorage.getItem(USER_ID) || '' })
                    );
                  }
                })
              )
              .subscribe();
          }
        })
      )
      .subscribe();

      // TODO: figure out why two post requests are being made

    // trip$
    // .pipe(
    //   take(1),
    //   switchMap((trip) => {
    //     if (userId && !tripId) {
    //       const updatedTrip = {
    //         ...trip,
    //         userId: JSON.parse(JSON.stringify(userId)),
    //       };
    //       return this.cartService.addTrip(updatedTrip).pipe(
    //         switchMap((newTrip) => {
    //           if (newTrip.id) {
    //             localStorage.setItem(TRIP_ID, newTrip.id);
    //             return this.cartService
    //               .addTripIdToUser(userId, newTrip.id)
    //               .pipe(
    //                 tap(() => {
    //                   this.store.dispatch(
    //                     setTripId({ id: localStorage.getItem(TRIP_ID) || '' })
    //                   );
    //                   this.store.dispatch(
    //                     setUserId({ userId: localStorage.getItem(USER_ID) || '' })
    //                   );
    //                 })
    //               );
    //           } else {
    //             return EMPTY; // No need to perform any further actions
    //           }
    //         })
    //       );
    //     } else {
    //       return EMPTY; // No need to perform any further actions
    //     }
    //   })
    // )
    // .subscribe();

    this.router.navigate(['passengers']);
  }
}
