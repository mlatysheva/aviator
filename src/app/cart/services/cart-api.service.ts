import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, concatMap, forkJoin, map, mergeMap, of, switchMap, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../constants/apiUrls';
import { Store } from '@ngrx/store';
import { ICart } from '../../models/cart';
import { ITrip } from '../../models/trip';
import { IUser } from '../../models';

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

  getTripsByUserId(id: string) {
    return this.http.get<IUser>(`${baseUrl}/users/${id}`).pipe(
      catchError(error => this.handleError(error)),
      switchMap((user: IUser) => {
        if(user.tripsIds?.length) {
          return forkJoin(user.tripsIds.map(tripId => this.getTrip(tripId)));
        }
        return of([]);
      })
    )
  }

  isCodeApplied(id: string) {
    return this.http.get<IUser>(`${baseUrl}/users/${id}`).pipe(
      catchError(error => this.handleError(error)),
      map((user: IUser) => user.isCodeApplied || false)
    )
  }

  getUnpaidTripsByUserId(id: string) {
    return this.http.get<IUser>(`${baseUrl}/users/${id}`).pipe(
      catchError(error => this.handleError(error)),
      switchMap((user: IUser) => {
        if(user.tripsIds?.length) {
          return forkJoin(user.tripsIds.map(tripId => this.getTrip(tripId))).pipe(
            map((trips: ITrip[]) => trips.filter(trip => !trip.isPaid))
          );
        }
        return of([]);
      })
    )
  }

  getPaidTripsByUserId(id: string) {
    return this.http.get<IUser>(`${baseUrl}/users/${id}`).pipe(
      catchError(error => this.handleError(error)),
      switchMap((user: IUser) => {
        if(user.tripsIds?.length) {
          return forkJoin(user.tripsIds.map(tripId => this.getTrip(tripId))).pipe(
            map((trips: ITrip[]) => trips.filter(trip => trip.isPaid))
          );
        }
        return of([]);
      })
    )
  }

  getUnpaidTripsByCartId(id: string) {
    return this.http.get<ICart>(`${baseUrl}/carts/${id}`).pipe(
      catchError(error => this.handleError(error)),
      switchMap((cart: ICart) => {
        if(cart.tripsIds?.length) {
          return forkJoin(cart.tripsIds.map(tripId => this.getTrip(tripId))).pipe(
            map((trips: ITrip[]) => trips.filter(trip => !trip.isPaid))
          );
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

  updateTripPrice(id: string, totalAmount: number) {
    const response$ = this.http.patch<ITrip>(`${baseUrl}/trips/${id}`, { totalAmount });
    response$
      .pipe(
        catchError(error => this.handleError(error))
      )
      .subscribe((trip: ITrip) => {
        this.errorMessage$.next('');
      });
    return response$;
  }

  payTrip(id: string) {
    const response$ = this.http.patch<ITrip>(`${baseUrl}/trips/${id}`, { isPaid: true });
    response$
      .pipe(
        catchError(error => this.handleError(error))
      )
      .subscribe((trip: ITrip) => {
        this.errorMessage$.next('');
      });
    return response$;
  }

  applyPromoCode(id: string, factor = 0.95): Observable<ITrip[]> {
    return this.http.patch<IUser>(`${baseUrl}/users/${id}`, { isCodeApplied: true }).pipe(
      switchMap(() => this.getUnpaidTripsByUserId(id)),
      catchError(error => this.handleError(error)),
      tap((trips: ITrip[]) => {
        trips.forEach((trip: ITrip) => {
          if (trip.id) {
            this.updateTripPrice(trip.id, Math.round(trip.totalAmount * factor));
          }
        });
      }),
      switchMap(() => this.getUnpaidTripsByUserId(id)),
    );
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
