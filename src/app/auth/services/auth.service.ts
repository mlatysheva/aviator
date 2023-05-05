import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, retry, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IUser } from '../../models';
import { baseUrl } from '../../constants/apiUrls';
import { USER_EMAIL, USER_ID, USER_NAME } from '../../constants/localStorage';
import { Store } from '@ngrx/store';
import { clearUserState } from '../../store/actions/user.actions';


@Injectable({
  providedIn: 'root',
})

export class AuthService {
  isVisible$ = new BehaviorSubject<boolean>(false);

  isAuth$ = new BehaviorSubject<boolean>(
    !!localStorage.getItem(USER_ID),
  );

  userName$ = new BehaviorSubject<string>(
    localStorage.getItem(USER_NAME) || '',
  );

  email$ = new BehaviorSubject<string>(
    localStorage.getItem(USER_EMAIL) || '',
  );

  errorMessage$ = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    private store: Store,
  ) {}

  onLogin(email: string, password: string) {
    const response$ = this.http.post<IUser>(`${baseUrl}/login`, { email, password });
    response$
      .pipe(
        catchError(error => {
          let message = '';
          if (error.error instanceof ErrorEvent) {
            message = `Error: ${error.error.message}`
            this.errorMessage$.next(message);
          } else {
            message = `Error Code: ${error.status}; Message: ${error.message}`
            this.errorMessage$.next(message);
          }
          return throwError(error);
        })
      )
    .subscribe((userData: IUser) => {
      if (userData.id) {
        localStorage.setItem(USER_ID, userData.id);
      }
      if (userData.firstName) {
        localStorage.setItem(USER_NAME, userData.firstName);
      } 
      if (userData.email) {
        localStorage.setItem(USER_EMAIL, userData.email);
      }
      this.isAuth$.next(true);
      this.isVisible$.next(false);
    });
    return response$;    
  }

  onSignup(user: IUser) {
    return this.http.post<IUser>(`${baseUrl}/users`, user)
      .pipe(retry(1), catchError(this.handleError));
  }

  onLogout() {
    localStorage.clear();
    this.store.dispatch(clearUserState());
    this.isAuth$.next(false);
  }

  handleError(error: any) {
    console.log('we are in handleError');
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
      this.errorMessage$.next(errorMessage);
      console.log(this.errorMessage$);
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      this.errorMessage$.next(errorMessage);
      console.log('this.errorMessage$ is', this.errorMessage$);
    }
    return throwError(errorMessage);
  }
}
