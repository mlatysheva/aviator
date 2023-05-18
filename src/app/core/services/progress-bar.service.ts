import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProgressBar } from 'src/app/models/progress-bar';

@Injectable({
  providedIn: 'root',
})
export class ProgressBarService {
  public progressBar$ = new BehaviorSubject<IProgressBar[]>([]);
}
