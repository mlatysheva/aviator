import { createAction, props } from '@ngrx/store';
import { IUser } from '../../models';

export const setCurrency = createAction(
  '[Header] Set Currency',
  props<{ currency: string }>()
);

export const setDateFormat = createAction(
  '[Header] Set Date Format',
  props<{ dateFormat: string }>()
);

export const setUserProfile = createAction(
  '[Login] Set User Profile',
  props<{
    email: string;
    password: string;
  }>()
);

export const setUserContactDetails = createAction(
  '[Booking Passengers] Set User Contact Details',
  props<{
    countryCode: string;
    phone: string;
    email: string;
  }>()
);

export const setUserProfileSuccess = createAction(
  '[Login] Set User Profile Successfully',
  props<{
    userProfile: IUser;
  }>()
);

export const setUserProfileFailure = createAction(
  '[Login] Failed to Set User Profile',
  props<{ error: string }>()
);

export const loadUserProfile = createAction(
  '[App] Load User Profile',
  props<{ id: string }>(),
);

export const loadUserProfileSuccess = createAction(
  '[App] Load User Profile Successfully',
  props<{
    userProfile: IUser
  }>(),
);

export const loadUserProfileFailure = createAction(
  '[App] Failed to Load User Profile',
  props<{ error: string }>(),
);

export const clearUserState = createAction(
  '[Header Logout] Cleared User State'
);
