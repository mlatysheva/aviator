import { ActionReducerMap } from '@ngrx/store';
import {
  passengersReducer,
  PassengersState,
} from './reducers/passengers.reducer';
import { searchReducer, SearchFormState } from './reducers/search.reducer';
import { UserState, userReducer } from './reducers/user.reducer';

export interface AppState {
  user: UserState;
  search: SearchFormState;
  passengersInfo: PassengersState;
  // cart: CartState;
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
  search: searchReducer,
  passengersInfo: passengersReducer,
  // cart: cartReducer,
};
