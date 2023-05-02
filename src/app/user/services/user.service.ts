import { Injectable } from '@angular/core';
import { ICountryCode } from '../../models/countryCode';
import { baseUrl } from '../../constants/apiUrls';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  public getCountryCodes(): Observable<ICountryCode[]> {
    const countryCodesUrl = `${baseUrl}/countryCodes`;
    return this.http.get<ICountryCode[]>(countryCodesUrl);
  }

  registerUser(user: IUser) {
    const registerUrl = `${baseUrl}/users`;
    return this.http.post(registerUrl, user);
  }
}
