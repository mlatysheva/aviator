import { Component, Input } from '@angular/core';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.scss']
})
export class FlightDetailsComponent {

  @Input() isFly: string;
  @Input() from: string;
  @Input() to: string;
  @Input() startDate: string;
  @Input() currency: string;
  @Input() index: number;
  @Input() prices: number[] = [];
  @Input() price: number
  @Input() seats: number;
  @Input() hours: number;
  @Input() minutes: number;
  @Input() timeZoneFrom: string | undefined;
  @Input() timeZoneTo: string | undefined;
  @Input() departureTime: string;
  @Input() arrivingDateTo: string | undefined;
  @Input() flightNumber: string;
  @Input() onClick: (e: MouseEvent) => void;
  @Input() isTo: boolean;

  constructor(
    public dateService: DateService
  ) { }

}




