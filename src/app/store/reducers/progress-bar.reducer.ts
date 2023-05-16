import { createReducer, on } from '@ngrx/store';
import * as ProgressBarActions from '../actions/progress-bar.actions';
import { IProgressBar } from '../../models/progress-bar';

export interface ProgressBarState {
  progressBar: IProgressBar[];
}

export const initialState: ProgressBarState = {
  progressBar: [],
};

export const progressBarReducer = createReducer(
  initialState,
  on(
    ProgressBarActions.setProgressBar,
    (state, payload): ProgressBarState => ({
      ...state,
      progressBar: [...payload.progressBar],
    })
  ),
  on(ProgressBarActions.clearProgressBarState, () => ({
    ...initialState,
    progressBar: [],
  }))
);
