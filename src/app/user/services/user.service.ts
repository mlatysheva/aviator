import { Injectable } from '@angular/core';
import { ICountryCode } from '../../models/countryCode';
import { baseUrl } from '../../constants/apiUrls';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  public onLoad(id: string): Observable<any> {
    const userProfileUrl = `${baseUrl}/users/${id}`;
    return this.http.get<any>(userProfileUrl);
  }
}
