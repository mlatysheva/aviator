import { createSelector } from '@ngrx/store';
import { IContacts } from 'backend/types';
import { IPassenger } from 'src/app/models/passenger';
import { AppState } from '../state.models';

export const selectPassengers = (state: AppState) =>
  state.passengers.passengers;

export const selectContactDetails = (state: AppState) =>
  state.passengers.details;

export const selectTrip = createSelector(
  selectPassengers,
  (passengers: IPassenger[]) => passengers
);

export const selectContacts = createSelector(
  selectContactDetails,
  (details: IContacts) => details
);
