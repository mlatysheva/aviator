import { createReducer, on } from '@ngrx/store';
import * as UserActions from '../actions/user.actions';
import { CURRENCY, DATE_FORMAT } from '../../constants/localStorage';

export const userFeatureKey = 'user';

export interface UserState {
  currency: string;
  dateFormat: string;
}

export const initialState: UserState = {
  currency: localStorage.getItem(CURRENCY) || 'EUR',
  dateFormat: localStorage.getItem(DATE_FORMAT) || 'DD/MM/YYYY',
};

export const userReducer = createReducer(
  initialState,
  on(
    UserActions.setCurrency, 
    (state, payload ): UserState => ({ 
      ...state, 
      currency: payload.currency,
    }),
  ),
  on(
    UserActions.setDateFormat,
    (state, payload): UserState => ({
      ...state,
      dateFormat: payload.dateFormat,
    }),
  ),
  on(
    UserActions.clearUserState,
    () => ({ ...initialState }),
  ),
);
