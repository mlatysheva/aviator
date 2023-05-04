import { createSelector } from '@ngrx/store';
import { IAgeTypeQuantity } from 'src/app/avia/models/agetype-quantity.model';
import { AppState } from '../state.models';

export const selectTripType = (state: AppState) => state.search.tripType;
export const selectDeparture = (state: AppState) => state.search.departure;
export const selectDestination = (state: AppState) => state.search.destination;
export const selectStartDate = (state: AppState) => state.search.startDate;
export const selectEndDate = (state: AppState) => state.search.endDate;
export const selectPassengers = (state: AppState) => state.search.passengers;

export const selectTrip = createSelector(
  selectTripType,
  (tripType: string) => tripType
);

export const selectAirportsIds = createSelector(
  selectDeparture,
  selectDestination,
  (departure: string, destination: string) => [departure, destination]
);

export const selectDates = createSelector(
  selectStartDate,
  selectEndDate,
  (startDate: string, endDate: string) => [startDate, endDate]
);

export const selectPersons = createSelector(
  selectPassengers,
  (passengers: IAgeTypeQuantity[]) => passengers
);

export const selectAllSearchDetails = createSelector(
  selectTripType,
  selectDeparture,
  selectDestination,
  selectStartDate,
  selectEndDate,
  selectPassengers,
  (
    tripType: string,
    departure: string,
    destination: string,
    startDate: string,
    endDate: string,
    passengers: IAgeTypeQuantity[]
  ) => [tripType, departure, destination, startDate, endDate, passengers]
);
