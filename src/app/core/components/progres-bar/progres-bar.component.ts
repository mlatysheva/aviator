import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IProgressBar } from '../../../models/progress-bar';
import { ProgressBarService } from '../../services/progress-bar.service';

@Component({
  selector: 'app-progres-bar',
  templateUrl: './progres-bar.component.html',
  styleUrls: ['./progres-bar.component.scss'],
})
export class ProgresBarComponent implements OnInit, OnDestroy {
  public progressBar: IProgressBar[];

  private subscriptions = new Subscription();

  constructor(private progressBarService: ProgressBarService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.progressBarService.progressBar$.subscribe(
        (progressBar) => (this.progressBar = progressBar)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
