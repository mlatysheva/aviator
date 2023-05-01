import { createSelector } from '@ngrx/store';
import { IPassenger } from 'src/app/models/passenger';
import { AppState } from '../state.models';

export const selectPassengers = (state: AppState) =>
  state.passengers.passengers;

export const selectTrip = createSelector(
  selectPassengers,
  (passengers: IPassenger[]) => passengers
);
