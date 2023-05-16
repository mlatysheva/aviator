import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IProgressBar } from '../../../models/progress-bar';
import { TRIP_ID, USER_ID } from '../../../constants/localStorage';
import { images } from '../../../constants/progressBarImgUrls';
import { ProgressBarService } from '../../../core/services/progress-bar.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/state.models';
import { CartApiService } from '../../../cart/services/cart-api.service';
import { ITrip } from '../../../models';

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
    this.router.navigate(['main']);
  }

  onNextClick() {
    this.progressBarService.setProgressBar(this.progressBar);

    this.store.select(state => state.trip).subscribe(data => {
      this.tripData = data;
      let newTrip;
      this.cartService.addTrip(this.tripData).subscribe(data => {
        newTrip = data;
        if (newTrip.id && !localStorage.getItem(TRIP_ID)) {
          localStorage.setItem(TRIP_ID, newTrip.id);
          const userId = localStorage.getItem(USER_ID);
          if (userId) {
            this.cartService.addTripIdToUser(userId, newTrip.id).subscribe(data => {
              console.log(data);
            });
          }
        }
      });
    });
    this.router.navigate(['passengers']);
  }
}
