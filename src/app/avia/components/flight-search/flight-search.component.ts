import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AviaService } from '../../services/avia.service';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss'],
})
export class FlightSearchComponent implements OnInit {
  public roundTrip = false;

  public searchForm: FormGroup;

  public passengersList: string[] = ['Adult', 'Child', 'Infant'];

  public tripType = 'round-trip';

  constructor(private aviaService: AviaService) {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      tripType: new FormControl('round-trip'),
      departure: new FormControl(''),
      destination: new FormControl(''),
      dates: new FormControl(''),
      passengers: new FormControl(''),
    });
  }

  public tripTypeChange() {
    this.roundTrip = this.tripType === 'round-trip' ? true : false;
  }

  public changeValues(): void {
    const departure = this.searchForm.get('departure')?.value;
    const destination = this.searchForm.get('destination')?.value;
    this.searchForm.controls['departure'].setValue(destination);
    this.searchForm.controls['destination'].setValue(departure);
  }

  public onSearch() {
    this.aviaService.search();
  }
}
