import { createAction, props } from '@ngrx/store';
import { IProgressBar } from '../../models/progress-bar';

export const setProgressBar = createAction(
  '[Progress Bar] Set Progress Bar State',
  props<{ progressBar: IProgressBar[] }>()
);

export const clearProgressBarState = createAction(
  '[Progress Bar] Cleared Progress Bar State'
);
