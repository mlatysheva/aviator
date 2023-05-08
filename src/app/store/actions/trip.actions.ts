import { createAction, props } from '@ngrx/store';
import { IContacts } from 'backend/types';
import { IPassenger } from 'src/app/models/passenger';

export const setSearchParameters = createAction(
  '[Main Page - Search] Set Search Parameters',
  props<{
    roundTrip: boolean;
    originAirportName: string;
    destinationAirportName: string;
  }>()
);

export const setPassengers = createAction(
  '[Booking Passengers] Set Trip Passengers',
  props<{ passengers: IPassenger[] }>()
);

export const setTripContactDetails = createAction(
  '[Booking Passengers] Set Trip Contact Details',
  props<{ contactDetails: IContacts }>()
);

export const clearTripState = createAction('[] Cleared Trip State');
