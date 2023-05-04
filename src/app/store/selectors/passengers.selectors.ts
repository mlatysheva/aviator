import { createSelector } from '@ngrx/store';
import { IContacts } from 'backend/types';
import { IPassenger } from 'src/app/models/passenger';
import { AppState } from '../state.models';

export const selectPassengers = (state: AppState) =>
  state.passengersInfo.passengers;

export const selectContactDetails = (state: AppState) =>
  state.passengersInfo.details;

export const selectAllPassengers = createSelector(
  selectPassengers,
  (passengers: IPassenger[]) => passengers
);

export const selectContacts = createSelector(
  selectContactDetails,
  (details: IContacts) => details
);
