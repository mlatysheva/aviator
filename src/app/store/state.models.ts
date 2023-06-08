import { ActionReducerMap } from '@ngrx/store';
import { tripReducer, TripState } from './reducers/trip.reducer';
import { UserState, userReducer } from './reducers/user.reducer';

export interface AppState {
  user: UserState;
  trip: TripState;
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
  trip: tripReducer,
};
