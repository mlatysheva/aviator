import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAirport } from '../../../models/airport';
import { Observable } from 'rxjs';
import { AviaService } from '../../services/avia.service';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss'],
})
export class FlightSearchComponent implements OnInit {
  public searchForm: FormGroup;

  public airports$: Observable<IAirport[]>;

  public passengersList: string[] = ['1 Adult', '1 Child', '1 Infant'];

  public tripType = 'round-trip';

  constructor(private aviaService: AviaService) {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      tripType: new FormControl('round-trip'),
      departure: new FormControl('', Validators.required),
      destination: new FormControl('', Validators.required),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      passengers: new FormControl('', Validators.required),
    });
    this.getAirportsList();
  }

  public getAirportsList(): Observable<IAirport[]> {
    this.airports$ = this.aviaService.getAirports();
    this.airports$.subscribe((value) => console.log(value));
    return this.airports$;
  }

  public changeValues(): void {
    const departure = this.searchForm.get('departure')?.value;
    const destination = this.searchForm.get('destination')?.value;
    this.searchForm.controls['departure'].setValue(destination);
    this.searchForm.controls['destination'].setValue(departure);
  }

  public onSearch() {
    if (this.searchForm.valid) {
      this.aviaService.search();
    }
    this.aviaService.isSearchSubmitted$.next(true);
  }
}
