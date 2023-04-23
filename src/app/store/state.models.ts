import { ActionReducerMap } from '@ngrx/store';
import { UserState, userReducer } from './reducers/user.reducer';

export interface AppState {
  user: UserState;
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
};