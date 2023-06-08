import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../models';
import { baseUrl } from '../../constants/apiUrls';
import { USER_EMAIL, USER_ID, USER_NAME } from '../../constants/localStorage';
import { Store } from '@ngrx/store';
import { clearUserState } from '../../store/actions/user.actions';
import { Router } from '@angular/router';
import { CartApiService } from '../../cart/services/cart-api.service';
import { clearTripState } from '../../store/actions/trip.actions';
import { clearSelectedTrip } from '../../store/actions/select.actions';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  isAuth$ = new BehaviorSubject<boolean>(
    !!localStorage.getItem(USER_ID),
  );

  userName$ = new BehaviorSubject<string>(
    localStorage.getItem(USER_NAME) || '',
  );

  userId$ = new BehaviorSubject<string>(
    localStorage.getItem(USER_ID) || '',
  );

  email$ = new BehaviorSubject<string>(
    localStorage.getItem(USER_EMAIL) || '',
  );

  errorMessage$ = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    private store: Store,
    private router: Router,
    private cartService: CartApiService,
  ) { }

  onLogin(email: string, password: string) {
    const response$ = this.http.post<IUser>(`${baseUrl}/login`, { email, password });
    response$
      .pipe(
        catchError(error => this.handleError(error))
      )
      .subscribe((userData: IUser) => {
        if (userData.firstName) {
          localStorage.setItem(USER_NAME, userData.firstName);
          this.userName$.next(userData.firstName);
        }
        if (userData.email) {
          localStorage.setItem(USER_EMAIL, userData.email);
          this.email$.next(userData.email);
        }
        if (userData.id) {
          localStorage.setItem(USER_ID, userData.id);
          this.userId$.next(userData.id);
        }
        this.isAuth$.next(true);
        this.errorMessage$.next('');
        this.cartService.getCartCount(userData.id || '').subscribe(count => {
          this.cartService.cartCount$.next(count);
        });
      });
    return response$;
  }

  onSignup(user: IUser) {
    const response$ = this.http.post<IUser>(`${baseUrl}/users`, user);
    response$
      .pipe(
        catchError(error => this.handleError(error))
      )
      .subscribe((userData: IUser) => {
        if (userData.firstName) {
          localStorage.setItem(USER_NAME, userData.firstName);
          this.userName$.next(userData.firstName);
        }
        if (userData.email) {
          localStorage.setItem(USER_EMAIL, userData.email);
          this.email$.next(userData.email);
        }
        this.errorMessage$.next('');
      });
    return response$;
  }

  onLogout() {
    localStorage.clear();
    this.store.dispatch(clearUserState());
    this.store.dispatch(clearTripState());
    this.store.dispatch(clearSelectedTrip());
    this.isAuth$.next(false);
    this.email$.next('');
    this.userId$.next('');
    this.userName$.next('');
    this.router.navigate(['/']);
    this.cartService.cartCount$.next(0);
  }

  setErrorMessage(message: string) {
    this.errorMessage$.next(message);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
