import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditModeService {
  summaryEditMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  isEditButtonVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  isEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  setSummaryEditMode(summaryEditMode: boolean): void {
    this.summaryEditMode$.next(summaryEditMode);
  }

  setEditButtonVisibility(isVisible: boolean): void {
    this.isEditButtonVisible$.next(isVisible);
  }

  onEdit(): void {
    this.isEdit$.next(true);
  }
}
