import { createAction, props } from '@ngrx/store';
import { SearchFormState } from '../reducers/search.reducer';

export const submitSearchForm = createAction(
  '[Flight Search] Form Submit',
  props<{ search: SearchFormState }>()
);

export const clearSearchState = createAction(
  '[Flight Search] Cleared Search State'
);
