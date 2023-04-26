import { createReducer, on } from '@ngrx/store';
import * as SearchActions from '../actions/search.actions';
import { TRIP_TYPE } from '../../constants/localStorage';
import { IAgeTypeQuantity } from 'src/app/avia/models/agetype-quantity.model';

export interface SearchFormState {
  tripType: string;
  departure: string;
  destination: string;
  startDate: string;
  endDate: string;
  passengers: IAgeTypeQuantity[];
}

export const initialState: SearchFormState = {
  tripType: localStorage.getItem(TRIP_TYPE) || 'round-trip',
  departure: '',
  destination: '',
  startDate: '',
  endDate: '',
  passengers: [],
};

export const searchReducer = createReducer(
  initialState,
  on(
    SearchActions.submitSearchForm,
    (state, payload): SearchFormState => ({
      ...state,
      tripType: payload.tripType,
      departure: payload.departure,
      destination: payload.destination,
      startDate: payload.startDate,
      endDate: payload.endDate,
      passengers: payload.passengers,
    })
  ),
  on(SearchActions.clearSearchState, () => ({ ...initialState }))
);
