import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProgressBar } from 'src/app/models/progress-bar';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/state.models';
import { setProgressBar } from 'src/app/store/actions/progress-bar.actions';
import { selectCurrentProgressBar } from 'src/app/store/selectors/progress-bar.selectors';

@Injectable({
  providedIn: 'root',
})
export class ProgressBarService {
  constructor(private store: Store<AppState>) {}

  public setProgressBar(progressBar: IProgressBar[]) {
    this.store.dispatch(setProgressBar({ progressBar }));
  }

  public getProgressBar(): Observable<IProgressBar[]> {
    return this.store.select(selectCurrentProgressBar);
  }
}
