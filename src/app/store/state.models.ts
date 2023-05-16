import { ActionReducerMap } from '@ngrx/store';
import {
  progressBarReducer,
  ProgressBarState,
} from './reducers/progress-bar.reducer';
import { searchReducer, SearchFormState } from './reducers/search.reducer';
import { tripReducer, TripState } from './reducers/trip.reducer';
import { UserState, userReducer } from './reducers/user.reducer';

export interface AppState {
  user: UserState;
  search: SearchFormState;
  trip: TripState;
  progressBar: ProgressBarState;
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
  search: searchReducer,
  trip: tripReducer,
  progressBar: progressBarReducer,
};
