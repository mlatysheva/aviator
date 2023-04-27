import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
    localStorage.getItem(USER_NAME) || localStorage.getItem(USER_EMAIL) || '',
  );

  constructor(
    private http: HttpClient,
    private store: Store,
  ) {}

  onLogin(login: string, password: string) {
    const response = this.http.post(`${baseUrl}/login`, { login, password });
    response.subscribe((userData: IUser) => {
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
  }

  onLogout() {
    localStorage.removeItem(USER_ID);
    localStorage.removeItem(USER_NAME);
    localStorage.removeItem(USER_EMAIL);
    this.store.dispatch(clearUserState());
    this.isAuth$.next(false);
  }
}
