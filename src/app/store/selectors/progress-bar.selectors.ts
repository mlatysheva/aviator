import { createSelector } from '@ngrx/store';
import { IProgressBar } from 'src/app/models/progress-bar';
import { AppState } from '../state.models';

export const selectProgressBar = (state: AppState) =>
  state.progressBar?.progressBar;

export const selectCurrentProgressBar = createSelector(
  selectProgressBar,
  (progressBar: IProgressBar[]) => progressBar
);
