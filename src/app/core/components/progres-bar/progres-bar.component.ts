import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCurrentProgressBar } from 'src/app/store/selectors/progress-bar.selectors';
import { AppState } from 'src/app/store/state.models';
import { IProgressBar } from '../../../models/progress-bar';

@Component({
  selector: 'app-progres-bar',
  templateUrl: './progres-bar.component.html',
  styleUrls: ['./progres-bar.component.scss'],
})
export class ProgresBarComponent implements OnInit {
  public progressBar$!: Observable<IProgressBar[]>;
  public progressBar: IProgressBar[];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.progressBar$ = this.store.select(selectCurrentProgressBar);
    this.progressBar$.subscribe(
      (progressBar) => (this.progressBar = progressBar)
    );
  }
}
