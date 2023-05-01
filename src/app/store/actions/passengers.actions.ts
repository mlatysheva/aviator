import { createAction, props } from '@ngrx/store';
import { IPassenger } from 'backend/types';

export const setPassengers = createAction(
  '[Booking Passengers] Set Passengers',
  props<{ passengers: IPassenger[] }>()
);

export const clearPassengersState = createAction(
  '[Booking Passengers] Cleared Passegers State'
);
