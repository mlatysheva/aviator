import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/state.models';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-second-menu',
  templateUrl: './second-menu.component.html',
  styleUrls: ['./second-menu.component.scss']
})
export class SecondMenuComponent implements OnInit {
  from: string;
  to: string;
  startDate: string;
  endDate: string;
  people: number;
  state$: Observable<AppState>;
  state: AppState;

  onClick() {
    this.from === this.from ? this.from = this.to : this.from;
    this.to === this.to ? this.to = this.from : this.to;
  }

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {

    this.state$ = this.store.select(appState => appState);
    this.state$.subscribe((state: AppState) => {
      this.from = state.search.departure.split(',').slice(0, 2).join('');
      this.to = state.search.destination.split(',').slice(0, 2).join('');
      this.startDate = state.search.startDate;
      this.endDate = state.search.endDate;
      this.people = state.search.passengers[0].quantity + state.search.passengers[1].quantity + state.search.passengers[2].quantity;
    });

  }


}



