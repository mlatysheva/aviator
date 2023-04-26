import { createAction, props } from '@ngrx/store';
import { SearchFormState } from '../reducers/search.reducer';

// export const submitSearchForm = createAction(
//   '[Flight Search] Search Form Is Submitted',
//   props<{ searchForm: FormGroup }>()
// );

export const submitSearchForm = createAction(
  '[Flight Search] Form Submit',
  props<SearchFormState>()
);

export const clearSearchState = createAction(
  '[Flight Search] Cleared Search State'
);
