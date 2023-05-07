import { createSelector } from '@ngrx/store';
import { IPassenger } from 'src/app/models/passenger';
import { AppState } from '../state.models';

export const selectPassengers = (state: AppState) =>
  state.passengersInfo.passengers;

export const selectAllPassengers = createSelector(
  selectPassengers,
  (passengers: IPassenger[]) => passengers
);
