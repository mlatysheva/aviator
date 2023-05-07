import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IAirport } from '../../models/airport';
import { HttpClient } from '@angular/common/http';
import { IFlight } from 'src/app/models/flight';

@Injectable({
  providedIn: 'root',
})
export class AviaService {
  constructor(private http: HttpClient) { }

  public isSearchSubmitted$ = new BehaviorSubject<boolean>(false);

  public getAirports(): Observable<IAirport[]> {
    const airportsRequestUrl = 'http://localhost:3000/airports';
    return this.http.get<IAirport[]>(airportsRequestUrl);
  }

  public getAllFlights(): Observable<IFlight[]> {
    const flightsRequestUrl = 'http://localhost:3000/flights';
    return this.http.get<IFlight[]>(flightsRequestUrl);
  }



  public search() {
    console.log('Search the flight');
  }
}
