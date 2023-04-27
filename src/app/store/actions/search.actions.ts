import { createAction, props } from '@ngrx/store';
import { SearchFormState } from '../reducers/search.reducer';

export const setSearchForm = createAction(
  '[Flight Search] Form Submit',
  props<{ search: SearchFormState }>()
);

export const clearSearchState = createAction(
  '[Flight Search] Cleared Search State'
);
