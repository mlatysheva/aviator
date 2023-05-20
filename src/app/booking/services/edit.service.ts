import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditService {

  public isEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  onEdit() {
    this.isEdit$.next(true);

  }
  onDone() {
    this.isEdit$.next(false);
  }

}
