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
  passengers: PassengersState;
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
  search: searchReducer,
  passengers: passengersReducer,
};
