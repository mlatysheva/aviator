import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../models';
import { baseUrl } from '../../constants/apiUrls';
import { Router } from '@angular/router';
import { USER_ID } from '../../constants/localStorage';


@Injectable({
  providedIn: 'root',
})

export class AuthService {
  isVisible$ = new BehaviorSubject<boolean>(false);

  isAuth$ = new BehaviorSubject<boolean>(
    !!localStorage.getItem(USER_ID),
  );

  userId$ = localStorage.getItem(USER_ID) || '';

  constructor(
    private http: HttpClient,
  ) {}

  onLogin(login: string, password: string) {
    const response = this.http.post(`${baseUrl}/login`, { login, password });
    response.subscribe((userData: IUser) => {
      if (userData.id) {
        this.userId$ = userData.id;
        localStorage.setItem(USER_ID, this.userId$);
        this.isAuth$.next(true);
        this.isVisible$.next(false);
      }
    });
  }
}
