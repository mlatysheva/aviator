import { createSelector } from '@ngrx/store';
import { IPassenger } from '../../models/passenger';
import { ITrip } from '../../models/trip';
import { AppState } from '../state.models';

export const selectPassengers = (state: AppState) => state.trip.passengers;
export const selectTrip = (state: AppState) => state.trip;

export const selectAllPassengers = createSelector(
  selectPassengers,
  (passengers: IPassenger[]) => passengers
);

//xport const selectTheTrip = createSelector(selectTrip, (trip: ITrip) => trip);
