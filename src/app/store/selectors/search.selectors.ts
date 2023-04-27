import { AppState } from '../state.models';

export const selectSearchFormValue = (state: AppState) => {
  state.search.tripType;
  state.search.departure;
  state.search.destination;
  state.search.startDate;
  state.search.endDate;
  state.search.passengers;
};
