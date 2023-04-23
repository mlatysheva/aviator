import { createAction, props } from '@ngrx/store';
import { IUser } from '../../models';

export const setCurrency = createAction(
  '[Header] Set Currency',
  props<{ currency: string }>(),
);

export const setDateFormat = createAction(
  '[Header] Set Date Format',
  props<{ dateFormat: string }>(),
);

export const clearUserState = createAction('[Header Logout] Cleared User State');




