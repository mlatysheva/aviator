import { createReducer, on } from '@ngrx/store';
import { IPassenger } from 'backend/types';
import * as PassengersActions from '../actions/passengers.actions';

export interface PassengersState {
  passengers: IPassenger[];
}

export const initialState: PassengersState = {
  passengers: [],
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
  on(PassengersActions.clearPassengersState, () => ({ ...initialState }))
);
