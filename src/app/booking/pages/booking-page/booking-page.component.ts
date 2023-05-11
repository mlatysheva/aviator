import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TRIP_ID } from 'src/app/constants/localStorage';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss'],
})
export class BookingPageComponent {
  constructor(private router: Router) {}
  onBackClick() {
    this.router.navigate(['main']);
  }

  onNextClick() {
    //TODO: create a separate method in a service, add a real id to the newly created trip and put in a LS
    localStorage.setItem(TRIP_ID, '88cec744-b2a2-4b87-abaf-1c7a6ee22f11');
    this.router.navigate(['passengers']);
  }
}
