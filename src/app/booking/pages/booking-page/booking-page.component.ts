import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/state.models';
import { IProgressBar } from '../../../models/progress-bar';
import { TRIP_ID, USER_ID } from '../../../constants/localStorage';
import { images } from '../../../constants/progressBarImgUrls';
import { ProgressBarService } from '../../../core/services/progress-bar.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/state.models';
import { CartApiService } from '../../../cart/services/cart-api.service';
import { ITrip } from '../../../models';
import { finalize, map } from 'rxjs';
import { selectTrip } from '../../../store/selectors/trip.selectors';
import * as SelectActions from '../../../store/actions/select.actions';


@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss'],
})
export class BookingPageComponent {
  public progressBar: IProgressBar[] = [
    { stepNo: 1, imgUrl: images.STEP_DONE, text: 'Flights' },
    { stepNo: 2, imgUrl: images.STEP_EDIT, text: 'Passengers' },
    { stepNo: 3, imgUrl: images.STEP_3, text: 'Review & Payment' },
  ];

  tripData: ITrip;

  constructor(
    private router: Router,
    private progressBarService: ProgressBarService, 
    private store: Store<AppState>,
    private cartService: CartApiService,
  ) {}

  onBackClick() {
    this.store.dispatch(SelectActions.clearSelectedTrip());
    this.router.navigate(['main']);
  }

  onNextClick() {
    this.progressBarService.setProgressBar(this.progressBar);

    const tripId = localStorage.getItem(TRIP_ID);
    const userId = localStorage.getItem(USER_ID);

    const trip$ = this.store.select(selectTrip);
    trip$.subscribe((trip) => {
      console.log(trip);
      if (userId && !tripId) {
        console.log('we are adding a new trip');
        this.cartService.addTrip(trip).pipe(
          map((trip) => {
            console.log('in map trip is', trip);
            if (trip.id){
              console.log('we are adding the new trip to the user');
              localStorage.setItem(TRIP_ID, trip.id);
              this.cartService.addTripIdToUser(trip.id, userId)
            }
          }),
        )
      }
    });
    this.router.navigate(['passengers']);
  }
}
