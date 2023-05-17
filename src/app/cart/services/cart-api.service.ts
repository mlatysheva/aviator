import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, concatMap, forkJoin, map, mergeMap, of, switchMap, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../constants/apiUrls';
import { Store } from '@ngrx/store';
import { ICart } from '../../models/cart';
import { ITrip } from '../../models/trip';
import { IUser } from '../../models';
import { USER_ID } from '../../constants/localStorage';
import { TripState } from '../../store/reducers/trip.reducer';

@Injectable({
  providedIn: 'root'
})

export class CartApiService {

  errorMessage$ = new BehaviorSubject<string>('');
  cartCount$ = new BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient,
  ) { this.getCartCount(localStorage.getItem(USER_ID) || '').subscribe(count => {
        this.cartCount$.next(count);
      });
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

  getCartCount(id: string) {
    const unpaidTrips = this.getUnpaidTripsByUserId(id);
    return unpaidTrips.pipe(
      map((trips: ITrip[]) => trips.length)
    )
  }

  setCartCount(count: number) {
    this.cartCount$.next(count);
  }

  incrementCartCount() {
    this.cartCount$.next(this.cartCount$.value + 1);
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

  getTripsIdsByUserId(id: string) {
    return this.http.get<IUser>(`${baseUrl}/users/${id}`).pipe(
      catchError(error => this.handleError(error)),
      switchMap((user: IUser) => {
        if(user.tripsIds?.length) {
          return user.tripsIds;
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

  addTrip(trip: TripState) {
    const response$ = this.http.post<ITrip>(`${baseUrl}/trips`, trip);
    response$
      .pipe(
        catchError(error => this.handleError(error))
      )
      .subscribe((trip: ITrip) => {
        this.errorMessage$.next('');
      });
    return response$;
  }

  updateTrip(trip: TripState) {
    const response$ = this.http.patch<ITrip>(`${baseUrl}/trips/${trip.id}`, trip);
    response$
      .pipe(
        catchError(error => this.handleError(error))
      )
      .subscribe((trip: ITrip) => {
        this.errorMessage$.next('');
      });
    return response$;
  }

  addTripIdToUser(userId: string, tripId: string) {
    const user = this.http.get<IUser>(`${baseUrl}/users/${userId}`);
    const tripsIds = user.pipe(
      map((user: IUser) => {
        if (user.tripsIds) {
          return [...user.tripsIds, tripId];
        }
        return [tripId];
      })
    );
    const response$ = tripsIds.pipe(
      switchMap((tripsIds: string[]) => this.http.patch<IUser>(`${baseUrl}/users/${userId}`, { tripsIds })) 
    );
    return response$;
  }

  removeTripIdFromUser(userId: string, tripId: string) {
    return this.http.get<IUser>(`${baseUrl}/users/${userId}`).pipe(
      map((user: IUser) => {
        if (user.tripsIds) {
          console.log('user.tripsIds', user.tripsIds);
          return user.tripsIds.filter(id => id !== tripId);
        }
        return [];
      }),
      switchMap((tripsIds: string[]) => 
        this.http.patch<IUser>(`${baseUrl}/users/${userId}`, { tripsIds })
      )
    );
  }

  deleteTrip(id: string, userId: string) {
    return this.removeTripIdFromUser(userId, id).pipe(
      switchMap(() => this.http.delete<ITrip>(`${baseUrl}/trips/${id}`)),
      catchError(error => {
        this.handleError(error);
        return of(null); 
      }),
      tap(() => {
        console.log('Trip deleted');
        this.errorMessage$.next('');
      })
    );
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
