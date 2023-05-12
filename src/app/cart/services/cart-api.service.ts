import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, concatMap, forkJoin, map, mergeMap, of, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../constants/apiUrls';
import { Store } from '@ngrx/store';
import { ICart } from '../../models/cart';
import { ITrip } from '../../models/trip';

@Injectable({
  providedIn: 'root'
})

export class CartApiService {

  errorMessage$ = new BehaviorSubject<string>('');
  cartCount$ = new BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient,
    private store: Store,
  ) {}

  getCart(id: string) {
    const response$ = this.http.get<ICart>(`${baseUrl}/carts/${id}`);
    response$
      .pipe(
        catchError(error => this.handleError(error))
      )
      .subscribe((cart: ICart) => {
        this.errorMessage$.next('');
      });
    return response$;
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

  deleteTrip(id: string) {
    const response$ = this.http.delete<ITrip>(`${baseUrl}/trips/${id}`);
    response$
      .pipe(
        catchError(error => this.handleError(error))
      )
      .subscribe((trip: ITrip) => {
        this.errorMessage$.next('');
      });
    return response$;
  }

  updateTripPrice(id: string, price: number) {
    console.log('we are in updateTripPrice');
    const response$ = this.http.patch<ITrip>(`${baseUrl}/trips/${id}`, { price });
    response$
      .pipe(
        catchError(error => this.handleError(error))
      )
      .subscribe((trip: ITrip) => {
        console.log('trip', trip);
        this.errorMessage$.next('');
      });
    return response$;
  }

  applyPromoCode(id: string, factor = 0.95) {
    console.log('we are in applyPromoCode');
    const trips = this.getTripsByCartId(id);
    console.log('trips', trips);
    trips
    .pipe(
      catchError(error => this.handleError(error)),
    )
    .subscribe((trips: ITrip[]) => {
      console.log('trips', trips);
      trips.map((trip: ITrip) => {
        console.log('trip', trip);
        if (trip.id) {
          const response$ = this.updateTripPrice(trip.id, trip.totalAmount * factor);
          console.log('response$', response$);
        }
      });
      return trips;
    });
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
