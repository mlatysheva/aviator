import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IPassenger } from 'backend/types';
import { IContacts, ITrip } from '../../models';
import { setPassengers } from '../../store/actions/trip.actions';
import { setTripContactDetails } from '../../store/actions/trip.actions';
import { baseUrl } from '../../constants/apiUrls';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PassengersService {
  errorMessage$ = new BehaviorSubject<string>('');

  constructor(private store: Store, private http: HttpClient) {}

  public setPassengers(passengers: IPassenger[]): void {
    this.store.dispatch(setPassengers({ passengers }));
  }

  public setContactDetails(contactDetails: IContacts): void {
    this.store.dispatch(setTripContactDetails({ contactDetails }));
  }

  public getAllTrips(): Observable<ITrip[]> {
    const tripsRequestUrl = 'http://localhost:3000/trips';
    return this.http.get<ITrip[]>(tripsRequestUrl);
  }

  public savePassengers(passengers: IPassenger[], id: string) {
    const response$ = this.http.patch<ITrip[]>(`${baseUrl}/trips/${id}/`, {
      passengers,
    });
    response$
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe(() => {
        this.errorMessage$.next('');
      });
    return response$;
  }

  handleError(error: any): any {
    throw new Error('Method not implemented.');
  }
}
