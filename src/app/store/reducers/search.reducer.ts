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
    SearchActions.setSearchForm,
    (state, payload): SearchFormState => ({
      ...state,
      ...payload,
    })
  ),
  on(SearchActions.clearSearchState, () => ({ ...initialState }))
);
