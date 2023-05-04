import { createReducer, on } from '@ngrx/store';
import * as UserActions from '../actions/user.actions';
import {
  CURRENCY,
  DATE_FORMAT,
  USER_ID,
  USER_NAME,
} from '../../constants/localStorage';
import { IUser } from '../../models';

export const userFeatureKey = 'user';

export interface UserState {
  currency: string;
  dateFormat: string;
  userProfile: IUser;
  error: string;
  isLoading: boolean;
}

export const initialState: UserState = {
  currency: localStorage.getItem(CURRENCY) || 'EUR',
  dateFormat: localStorage.getItem(DATE_FORMAT) || 'DD/MM/YYYY',
  userProfile: {
    email: '',
    password: '',
    firstName: localStorage.getItem(USER_NAME) || '',
    lastName: '',
    birthday: '',
    gender: undefined,
    contacts: {
      countryCode: '0',
      phone: '',
      email: '',
    },
    id: localStorage.getItem(USER_ID) || '',
  },
  error: '',
  isLoading: false,
};

export const userReducer = createReducer(
  initialState,
  on(
    UserActions.setCurrency,
    (state, payload): UserState => ({
      ...state,
      currency: payload.currency,
    })
  ),
  on(
    UserActions.setDateFormat,
    (state, payload): UserState => ({
      ...state,
      dateFormat: payload.dateFormat,
    })
  ),
  on(
    UserActions.setUserProfile,
    (state): UserState => ({
      ...state,
      isLoading: true,
    })
  ),
  on(
    UserActions.setUserProfileSuccess,
    (state, { userProfile }): UserState => ({
      ...state,
      userProfile,
      isLoading: false,
      error: '',
    })
  ),
  on(
    UserActions.setUserProfileFailure,
    (state, { error }): UserState => ({
      ...state,
      error,
      isLoading: false,
    })
  ),
  on(UserActions.clearUserState, () => ({
    ...initialState,
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    userProfile: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      birthday: '',
      gender: undefined,
      contacts: {
        countryCode: '0',
        phone: '',
        email: '',
      },
      id: '',
    },
  }))
);
