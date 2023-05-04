import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../models';
import { baseUrl } from '../../constants/apiUrls';
import { Router } from '@angular/router';
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

  constructor(
    private http: HttpClient,
    private store: Store,
  ) {}

  onLogin(login: string, password: string): Observable<IUser> {
    const response = this.http.post<IUser>(`${baseUrl}/login`, { login, password });
    response.subscribe((userData: IUser) => {
      if (userData.id) {
        localStorage.setItem(USER_ID, userData.id);
      }
      if (userData.firstName) {
        localStorage.setItem(USER_NAME, userData.firstName);
        this.userName$.next(userData.firstName);
      } 
      if (userData.email) {
        localStorage.setItem(USER_EMAIL, userData.email);
        this.email$.next(userData.email);
      }
      this.isAuth$.next(true);
      this.isVisible$.next(false);
    });
    return response;
  }

  onSignup(user: IUser) {
    const response = this.http.post<IUser>(`${baseUrl}/users`, user);
  }

  onLogout() {
    localStorage.clear();
    this.store.dispatch(clearUserState());
    this.isAuth$.next(false);
  }
}
