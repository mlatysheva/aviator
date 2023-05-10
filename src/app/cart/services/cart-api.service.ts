import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, of, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../constants/apiUrls';
import { Store } from '@ngrx/store';
import { ICart } from '../../models/cart';
import { ITrip } from '../../models';

@Injectable({
  providedIn: 'root'
})

export class CartApiService {

  errorMessage$ = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    private store: Store,
  ) {}

  getCart2(id: string) {
    const response$ = this.http.get<ICart>(`${baseUrl}/carts/${id}`);
    response$
      .pipe(
        catchError(error => this.handleError(error))
      )
      .subscribe((cart: ICart) => {
        if(cart.tripsIds?.length) {
          cart.trips = [];
          cart.tripsIds.forEach(tripId => {
            this.getTrip(tripId).subscribe(trip => {
              cart?.trips?.push(trip);
            });
          });
        }
        this.errorMessage$.next('');
      });
    return response$;    
  }

  getCart(id: string) {
    return this.http.get<ICart>(`${baseUrl}/carts/${id}`).pipe(
      catchError(error => this.handleError(error))
    )
    .subscribe((cart: ICart) => {
      this.errorMessage$.next('');
    });
  }

  getTripsByCartId2(id: string) {
    const response$ = this.http.get<ICart>(`${baseUrl}/carts/${id}`);
    const trips: ITrip[] = [];
    response$
      .pipe(
        catchError(error => this.handleError(error))
      )
      .subscribe((cart: ICart) => {
        if(cart.tripsIds?.length) {          
          cart.tripsIds.forEach(tripId => {
            this.getTrip(tripId).subscribe(trip => {
              trips.push(trip);
            });
          });
          // return trips;
        }
        this.errorMessage$.next('');
      });
    return trips;
  }

  getTripsByCartId(id: string) {
    return this.http.get<ICart>(`${baseUrl}/carts/${id}`).pipe(
      catchError(error => this.handleError(error)),
      switchMap((cart: ICart) => {
        if(cart.tripsIds?.length) {
          return forkJoin(cart.tripsIds.map(tripId => this.getTrip(tripId)));
        }
        return of([]);
      })
    )
  }

  getTrip(id: string) {
    const response$ = this.http.get<ITrip>(`${baseUrl}/trips/${id}`);
    response$
      .pipe(
        catchError(error => this.handleError(error))
      )
      .subscribe((trip: ITrip) => {
        this.errorMessage$.next('');
      });
    return response$;
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
      this.errorMessage$.next(errorMessage);
    } else {
      errorMessage = `${error.error.message}; error code: ${error.status}`;
      this.errorMessage$.next(errorMessage);
    }
    return throwError(errorMessage);
  }
}
