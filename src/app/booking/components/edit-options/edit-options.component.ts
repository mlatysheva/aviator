import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  Validators, FormBuilder, FormControl, FormGroup,
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/state.models';
import { EditService } from '../../services/edit.service';
import { IAgeTypeQuantity } from '../../../models/agetype-quantity.model';
import { AviaService } from '../../../avia/services/avia.service';
import { IAirport } from '../../../models/airport';
import { TRIP_TYPE } from '../../../constants/localStorage';
import { IAgeCategory } from '../../../models/passenger';
import * as SelectActions from '../../../store/actions/select.actions';


@Component({
  selector: 'app-edit-options',
  templateUrl: './edit-options.component.html',
  styleUrls: ['./edit-options.component.scss']
})
export class EditOptionsComponent implements OnInit, OnDestroy {

  @ViewChild(MatOption) matOption: MatOption;

  isEdit: boolean;

  private subscriptions = new Subscription();

  public selectedItems: IAgeTypeQuantity[] = [];

  public airports$: Observable<IAirport[]>;

  tripType = localStorage.getItem(TRIP_TYPE) || 'round-trip';

  codFrom: string;
  codTo: string;
  state$: Observable<AppState>;
  state: AppState;

  public passengersList: IAgeTypeQuantity[] = [
    { ageCategory: IAgeCategory.adult, quantity: 1 },
    { ageCategory: IAgeCategory.child, quantity: 0 },
    { ageCategory: IAgeCategory.infant, quantity: 0 },
  ];

  departure = new FormControl('');
  destination = new FormControl('');
  startDate = new FormControl('');
  endDate = new FormControl('');
  passengers = new FormControl(this.selectedItems);

  public editForm: FormGroup;


  constructor(
    public editService: EditService,
    private builder: FormBuilder,
    private aviaService: AviaService,
    private store: Store<AppState>,
  ) {
    this.isEdit = this.editService.isEdit$.value;
    this.passengersList.map((option) => this.selectedItems.push(option));
  }
  ngOnInit() {
    this.subscriptions.add(
      this.editService.isEdit$.subscribe((isEdit) => {
        this.isEdit = isEdit;
      })
    );
    this.getAirportsList();

    this.editForm = this.builder.group({
      departure: this.departure,
      destination: this.destination,
      startDate: this.startDate,
      endDate: this.endDate,
      passengers: this.passengers
    });

  }

  public getAirportsList(): Observable<IAirport[]> {
    this.airports$ = this.aviaService.getAirports();
    return this.airports$;
  }
  get departureName() {
    return this.editForm.get('departure');
  }
  get destinationName() {
    return this.editForm.get('destination');
  }

  onDepartureChange(event: any): void {
    this.codFrom = (this.departureName?.value.split(',')
      .slice(2, 3)
      .join(''));
    this.store.dispatch(SelectActions.setSelectedOriginCity({
      originCity: this.departureName?.value
        .split(',')
        .slice(1, 2)
        .join('')
    }));
    this.store.dispatch(SelectActions.setSelectedOriginAiroportName({
      originAiroportName: this.departureName?.value
        .split(',')
        .slice(0, 1)
        .join('')
    }));
    this.store.dispatch(SelectActions.setSelectedAiroportCodeOrigin({
      airportsIataCodeOrigin: this.codFrom
    }));
    //this.getTripState();
    this.changeFlight(this.codFrom, this.codTo);
  }

  onDestinationChange(event: any): void {
    this.codTo = (this.destinationName?.value.split(',')
      .slice(2, 3)
      .join(''));
    this.store.dispatch(SelectActions.setSelectedDestinationCity({
      destinationCity: this.destinationName?.value
        .split(',')
        .slice(1, 2)
        .join('')
    }));
    this.store.dispatch(SelectActions.setSelectedDestinationAiroportName({
      destinationAiroportName: this.destinationName?.value
        .split(',')
        .slice(0, 1)
        .join('')
    }));
    this.store.dispatch(SelectActions.setSelectedAiroportCodeDestination({
      airportsIataCodeDestination: this.codTo
    }));
    //this.getTripState();
    this.changeFlight(this.codFrom, this.codTo);
  }

  changeFlight(from: string, to: string) {
    this.aviaService.getAllFlights().subscribe((flights) => {
      const filteredFlights = flights.filter((flight) => {
        return flight.originAirportIataCode === from.toString().trim() &&
          flight.destinationAirportIataCode === to.toString().trim();
      });
      if (filteredFlights.length > 0) {

        console.log(filteredFlights);
      }
    }
    );
  }

  // public getTripState() {
  //   this.state$ = this.store.select((appState) => appState);
  //   this.subscriptions.add(
  //     this.state$.subscribe((state: AppState) => {
  //       this.codFrom = state.trip.airportsIataCodeOrigin;
  //       this.codTo = state.trip.airportsIataCodeDestination;

  //     }
  //     ));
  // }

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

  private stopPropagationFn(event: Event) {
    event.stopPropagation();
    this.matOption._selectViaInteraction();
  }

  onSubmit() {
    console.log(this.editForm.value.destination);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
