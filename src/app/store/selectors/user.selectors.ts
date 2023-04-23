import { AppState } from '../state.models';

export const selectUserCurrency = (state: AppState) => state.user.currency;

export const selectUserDateFormat = (state: AppState) => state.user.dateFormat;
