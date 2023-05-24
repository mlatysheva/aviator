import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/state.models';
import { TRIP_ID, USER_ID } from './constants/localStorage';
import { loadUserProfile } from './store/actions/user.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'aviator';

  id: string;

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.id = localStorage.getItem(USER_ID) || '';
    if (this.id) {
      this.store.dispatch(loadUserProfile({ id: this.id }));
    }
    if (localStorage.getItem(TRIP_ID)) {
      localStorage.removeItem(TRIP_ID);
    }
  }
}
