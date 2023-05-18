import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IAirport } from '../../models/airport';
import { HttpClient } from '@angular/common/http';
import { IFlight } from '../../models/flight';
import { baseUrl } from '../../constants/apiUrls';

@Injectable({
  providedIn: 'root',
})
export class AviaService {
  constructor(private http: HttpClient) {}

  public changeHeaderStyle$ = new BehaviorSubject<boolean>(false);

  public getAirports(): Observable<IAirport[]> {
    const airportsRequestUrl = 'http://localhost:3000/airports';
    return this.http.get<IAirport[]>(airportsRequestUrl);
  }

  public getAllFlights(): Observable<IFlight[]> {
    const flightsRequestUrl = 'http://localhost:3000/flights';
    return this.http.get<IFlight[]>(flightsRequestUrl);
  }
  public getAllFlightsByDate(date: string): Observable<IFlight[]> {
    const flightsRequestUrl = `http://localhost:3000/flights?date=${date}`;
    return this.http.get<IFlight[]>(flightsRequestUrl);
  }
  public getAllFlightsByDateAndFrom(
    date: string,
    from: string
  ): Observable<IFlight[]> {
    const flightsRequestUrl = `http://localhost:3000/flights?date=${date}&from=${from}`;
    return this.http.get<IFlight[]>(flightsRequestUrl);
  }
  public getAllFlightsByDateAndTo(
    date: string,
    to: string
  ): Observable<IFlight[]> {
    const flightsRequestUrl = `http://localhost:3000/flights?date=${date}&to=${to}`;
    return this.http.get<IFlight[]>(flightsRequestUrl);
  }
  public getFlightById(id: string): Observable<IFlight[]> {
    const flightsRequestUrl = `http://localhost:3000/flights/${id}`;
    return this.http.get<IFlight[]>(flightsRequestUrl);
  }

  public getFlightsPair(from: string, to: string): Observable<any> {
    const flightsRequestUrl = `${baseUrl}/flightspair`;
    return this.http.post(flightsRequestUrl, {
      originAirportIataCode: from.trim(),
      destinationAirportIataCode: to.trim(),
    });
  }
}
