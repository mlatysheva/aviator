import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectCurrentProgressBar } from 'src/app/store/selectors/progress-bar.selectors';
import { AppState } from 'src/app/store/state.models';
import { IProgressBar } from '../../../models/progress-bar';

@Component({
  selector: 'app-progres-bar',
  templateUrl: './progres-bar.component.html',
  styleUrls: ['./progres-bar.component.scss'],
})
export class ProgresBarComponent implements OnInit, OnDestroy {
  public progressBar$!: Observable<IProgressBar[]>;
  public progressBar: IProgressBar[];

  private subscriptions = new Subscription();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.progressBar$ = this.store.select(selectCurrentProgressBar);
    this.subscriptions.add(
      this.progressBar$.subscribe(
        (progressBar) => (this.progressBar = progressBar)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
