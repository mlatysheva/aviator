import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAgeCategory, IPassenger } from 'backend/types';
import { map, Observable } from 'rxjs';
import { IAgeTypeQuantity } from 'src/app/avia/models/agetype-quantity.model';
import { ISearchForm } from 'src/app/avia/models/search-form.model';
import { selectPassengers } from 'src/app/store/selectors/search.selectors';
import { AppState } from 'src/app/store/state.models';

@Component({
  selector: 'app-booking-passengers',
  templateUrl: './booking-passengers.component.html',
  styleUrls: ['./booking-passengers.component.scss'],
})
export class BookingPassengersComponent implements OnInit {
  public searchForm$!: Observable<ISearchForm | any>;
  public passengers: IAgeTypeQuantity[];
  public cards: IPassenger[] = [];

  public checked = false;
  public disabled = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.searchForm$ = this.store.select(selectPassengers);
    this.searchForm$
      .pipe(map((value) => this.setPassengers(value)))
      .subscribe();
  }

  public createNewPassenger(): IPassenger {
    return {
      id: '',
      firstName: '',
      lastName: '',
      birthday: '',
      age: 0,
      ageCategory: IAgeCategory.infant,
      seatNo: '',
    };
  }

  public setPassengers(persons: IAgeTypeQuantity[]): void {
    persons.forEach((person) => {
      for (let i = 0; i < person.quantity; i++) {
        const newPerson = this.createNewPassenger();
        newPerson.ageCategory = person.ageCategory;
        this.cards.push(newPerson);
      }
    });
  }
}
