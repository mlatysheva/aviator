import { AppState } from '../state.models';

export const selectUserCurrency = (state: AppState) => state.user.currency;

export const selectUserDateFormat = (state: AppState) => state.user.dateFormat;

export const selectUserProfile = (state: AppState) => state.user.userProfile;

export const selectUserError = (state: AppState) => state.user.error;

export const selectUserIsLoading = (state: AppState) => state.user.isLoading;