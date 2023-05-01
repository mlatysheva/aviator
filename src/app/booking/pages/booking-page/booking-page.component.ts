import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss']
})
export class BookingPageComponent {

  constructor(
    private router: Router
  ) { }
  onBackClick() {
    this.router.navigate(['main']);
  }

  onNextClick() {
    this.router.navigate(['passengers']);
  }

}
