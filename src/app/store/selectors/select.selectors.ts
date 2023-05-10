import { createSelector } from '@ngrx/store';
import { AppState } from '../state.models';
import { IPassenger } from '../../models/passenger';

export const choosenTripType = (state: AppState) => state.trip.roundTrip;
export const choosenDeparture = (state: AppState) => state.trip.originCity;
export const choosenDestination = (state: AppState) => state.trip.destinationCity;
export const choosenStartDate = (state: AppState) => state.trip.outboundDepartureDate;
export const choosenEndDate = (state: AppState) => state.trip.returnDepartureDate ? state.trip.returnDepartureDate : '';
export const choosenPassengers = (state: AppState) => state.trip.passengers;

export const chooseTrip = createSelector(
  choosenTripType,
  (roundTrip: boolean) => roundTrip
);

export const chooseAirports = createSelector(
  choosenDeparture,
  choosenDestination,
  (originCity: string, destinationCity: string) => [originCity, destinationCity]
);

export const selectDates = createSelector(
  choosenStartDate,
  choosenEndDate,
  (choosenStartDate: string, choosenEndDate: string) => [choosenStartDate, choosenEndDate]
);

export const choosenPersons = createSelector(
  choosenPassengers,
  (passengers: IPassenger[]) => passengers
);

export const ChoosenDetails = createSelector(
  choosenTripType,
  choosenDeparture,
  choosenDestination,
  choosenStartDate,
  choosenEndDate,
  choosenPassengers,
  (
    roundTrip: boolean,
    originCity: string,
    destinationCity: string,
    outboundDepartureDate: string,
    returnDepartureDate: string,
    passengers: IPassenger[]
  ) => [roundTrip, originCity, destinationCity, outboundDepartureDate, returnDepartureDate, passengers]
);
