import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditModeService {
  editMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  
  setEditMode(editMode: boolean): void {
    this.editMode$.next(editMode);
  }
}