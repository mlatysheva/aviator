import { IAirport } from './airport';

export interface IFlight {
  date: Date,
  origin: IAirport,
  destination: IAirport,
  priceAdult: number,
  priceChild: number,
  priceInfant: number,
  duration: number,
  direct: boolean,
  flightNumber: string,
  taxRate?: number,
  totalSeats: number,
}