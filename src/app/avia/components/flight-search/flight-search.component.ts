import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAirport } from '../../../models/airport';
import { Observable } from 'rxjs';
import { AviaService } from '../../services/avia.service';
import { IAgeTypeQuantity } from '../../models/agetype-quantity.model';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss'],
})
export class FlightSearchComponent implements OnInit {
  public searchForm: FormGroup;

  public airports$: Observable<IAirport[]>;

  public passengersList: IAgeTypeQuantity[] = [
    { ageType: 'Adult', quantity: 1 },
    { ageType: 'Child', quantity: 0 },
    { ageType: 'Infant', quantity: 0 },
  ];

  public tripType = 'round-trip';

  public selectedItem = '1 Adult';

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

  public increase(specificAgeType: IAgeTypeQuantity) {
    specificAgeType.quantity++;
  }

  public decrease(specificAgeType: IAgeTypeQuantity) {
    if (specificAgeType.quantity > 0) {
      specificAgeType.quantity--;
    }
  }

  public onSearch() {
    if (this.searchForm.valid) {
      this.aviaService.search();
    }
    this.aviaService.isSearchSubmitted$.next(true);
  }
}
