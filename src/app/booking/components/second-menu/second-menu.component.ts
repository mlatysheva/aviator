import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/state.models';
import { Observable } from 'rxjs';
//import { EditService } from '../../services/edit.service';
import { EditModeService } from '../../../shared/services/edit-mode.service';

@Component({
  selector: 'app-second-menu',
  templateUrl: './second-menu.component.html',
  styleUrls: ['./second-menu.component.scss'],
})
export class SecondMenuComponent implements OnInit {
  cityFrom: string;
  cityTo: string;
  airoportFrom: string;
  airoportTo: string;
  startDate: string;
  endDate: string | undefined;
  people: number;
  state$: Observable<AppState>;
  state: AppState;
  isEdit: boolean;

  editMode: boolean;
  isEditButtonVisible: boolean;

  onClick() {
    this.cityFrom === this.cityFrom ? (this.cityFrom = this.cityTo) : this.cityFrom;
    this.cityTo === this.cityTo ? (this.cityTo = this.cityFrom) : this.cityTo;
  }


  constructor(
    private store: Store<AppState>,
    private editModeService: EditModeService,
    // private editService: EditService
  ) { }

  ngOnInit() {
    this.state$ = this.store.select((appState) => appState);
    this.state$.subscribe((state: AppState) => {
      this.cityFrom = state.trip.originCity;
      this.cityTo = state.trip.destinationCity;
      this.airoportFrom = state.trip.originAiroportName;
      this.airoportTo = state.trip.destinationAiroportName;
      this.startDate = state.trip.outboundDepartureDate;
      this.endDate = state.trip.returnDepartureDate;
      this.people = state.trip.numberOfPassengers[0]?.quantity +
        state.trip.numberOfPassengers[1]?.quantity +
        state.trip.numberOfPassengers[2]?.quantity;
    });
    this.isEdit = false;
    // this.editModeService.editMode$.subscribe((editMode: boolean) => {
    //   this.editMode = editMode;
    // });
    this.editModeService.isEditButtonVisible$.subscribe((isEditButtonVisible: boolean) => {
      this.isEditButtonVisible = isEditButtonVisible;
    });
  }
  onEdit() {
    if (this.isEdit === false) {
      this.isEdit = true;
      this.editModeService.isEdit$.next(this.isEdit);
    }
    else if (this.isEdit === true) {
      this.isEdit = false;
      this.editModeService.isEdit$.next(this.isEdit);
    }
  }

}
