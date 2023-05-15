import { createAction, props } from '@ngrx/store';
import { IContacts } from 'backend/types';
import { IAgeTypeQuantity } from 'src/app/models/agetype-quantity.model';
import { IPassenger } from '../../models/passenger';

export const setSearchParameters = createAction(
  '[Main Page - Search] Set Search Parameters',
  props<{
    roundTrip: boolean;
    originCity: string;
    destinationCity: string;
    airportsIataCodes: string[];
    outboundDepartureDate: string;
    originAiroportName: string;
    destinationAiroportName: string;
    returnDepartureDate: string;
    numberOfPassengers: IAgeTypeQuantity[];
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
