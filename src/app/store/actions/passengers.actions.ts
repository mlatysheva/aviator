import { createAction, props } from '@ngrx/store';
import { IPassenger } from 'backend/types';
import { IContacts } from 'src/app/models';

export const setPassengers = createAction(
  '[Booking Passengers] Set Passengers',
  props<{ passengers: IPassenger[] }>()
);

export const setContactDetails = createAction(
  '[Booking Passengers] Set Contact Details',
  props<{ contactDetails: IContacts }>()
);

export const clearPassengersState = createAction(
  '[Booking Passengers] Cleared Passegers State'
);
