import { createReducer, on } from '@ngrx/store';
import { IPassenger } from 'backend/types';
import { IContacts } from 'src/app/models';
import * as PassengersActions from '../actions/passengers.actions';

export interface PassengersState {
  passengers: IPassenger[];
  details: IContacts;
}

export const initialState: PassengersState = {
  passengers: [],
  details: {
    countryCode: '+0',
    phone: '',
    email: '',
  },
};

export const passengersReducer = createReducer(
  initialState,
  on(
    PassengersActions.setPassengers,
    (state, payload): PassengersState => ({
      ...state,
      passengers: payload.passengers,
    })
  ),
  on(
    PassengersActions.setContactDetails,
    (state, payload): PassengersState => ({
      ...state,
      details: payload.contactDetails,
    })
  ),
  on(PassengersActions.clearPassengersState, () => ({ ...initialState }))
);
