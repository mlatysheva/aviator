import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAirport } from '../../../models/airport';
import { Observable } from 'rxjs';
import { AviaService } from '../../services/avia.service';
import { IAgeTypeQuantity } from '../../models/agetype-quantity.model';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss'],
})
export class FlightSearchComponent implements OnInit {
  @ViewChild(MatOption) matOption: MatOption;

  public searchForm: FormGroup;

  public airports$: Observable<IAirport[]>;

  public passengersList: IAgeTypeQuantity[] = [
    { ageType: 'Adult', quantity: 1 },
    { ageType: 'Child', quantity: 0 },
    { ageType: 'Infant', quantity: 0 },
  ];

  public tripType = 'round-trip';

  public selectedItems: IAgeTypeQuantity[] = [];

  constructor(private aviaService: AviaService) {
    this.passengersList.map((option) => this.selectedItems.push(option));
  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      tripType: new FormControl('round-trip'),
      departure: new FormControl('', Validators.required),
      destination: new FormControl('', Validators.required),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      passengers: new FormControl(this.selectedItems, Validators.required),
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

  stopPropagationFn(event: Event) {
    event.stopPropagation();
    this.matOption._selectViaInteraction();
  }

  public increase(event: Event, specificAgeType: IAgeTypeQuantity) {
    specificAgeType.quantity++;
    this.stopPropagationFn(event);
  }

  public decrease(event: Event, specificAgeType: IAgeTypeQuantity) {
    if (specificAgeType.quantity > 0) {
      specificAgeType.quantity--;
    }
    this.stopPropagationFn(event);
  }

  public onSearch() {
    if (this.searchForm.valid) {
      this.aviaService.search();
    }
    //console.log(this.searchForm.value);
    this.aviaService.isSearchSubmitted$.next(true);
  }
}
