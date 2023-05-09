import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IPassenger } from 'backend/types';
import { IContacts } from 'src/app/models';
import { setPassengers } from 'src/app/store/actions/trip.actions';
import { setTripContactDetails } from 'src/app/store/actions/trip.actions';

@Injectable({
  providedIn: 'root',
})
export class PassengersService {
  constructor(private store: Store) {}

  public setPassengers(passengers: IPassenger[]): void {
    this.store.dispatch(setPassengers({ passengers }));
  }

  public setContactDetails(contactDetails: IContacts): void {
    this.store.dispatch(setTripContactDetails({ contactDetails }));
  }
}
