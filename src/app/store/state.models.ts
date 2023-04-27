import { ActionReducerMap } from '@ngrx/store';
import { searchReducer, SearchFormState } from './reducers/search.reducer';
import { UserState, userReducer } from './reducers/user.reducer';

export interface AppState {
  user: UserState;
  search: SearchFormState;
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
  search: searchReducer,
};
