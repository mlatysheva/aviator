import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IProgressBar } from '../../../models/progress-bar';
import { TRIP_ID } from '../../../constants/localStorage';
import { images } from '../../../constants/progressBarImgUrls';
import { ProgressBarService } from '../../../core/services/progress-bar.service';

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

  constructor(
    private router: Router,
    private progressBarService: ProgressBarService
  ) {}

  onBackClick() {
    this.router.navigate(['main']);
  }

  onNextClick() {
    this.progressBarService.setProgressBar(this.progressBar);
    //TODO: create a separate method in a service, add a real id to the newly created trip and put in a LS
    localStorage.setItem(TRIP_ID, '88cec744-b2a2-4b87-abaf-1c7a6ee22f11');
    this.router.navigate(['passengers']);
  }
}
