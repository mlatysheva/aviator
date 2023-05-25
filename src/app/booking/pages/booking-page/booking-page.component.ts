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
import { EditModeService } from '../../../shared/services/edit-mode.service';

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
    private cartService: CartApiService,
    private editModeService: EditModeService,
  ) {}

  onBackClick() {
    this.store.dispatch(SelectActions.clearSelectedTrip());
    this.router.navigate(['main']);
  }

  onNextClick() {
    this.progressBarService.progressBar$.next(progressBar.PASSENGERS);

    this.editModeService.isEditButtonVisible$.next(false);

    const tripId = localStorage.getItem(TRIP_ID);
    const userId = localStorage.getItem(USER_ID);

    const trip$ = this.store.select(selectTrip);
    trip$
      .pipe(
        take(1),
        tap((trip) => {
          if (userId && tripId) {
            this.cartService
            .updateTrip(trip)
            
            .subscribe();
          } else if (userId && !tripId) {
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

    this.router.navigate(['passengers']);
  }
}
