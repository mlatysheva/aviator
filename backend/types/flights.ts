export interface IFlight {
  id?: string,
  date?: Date,
  originAirportIataCode: string, 
  destinationAirportIataCode: string,
  priceAdult: number,
  priceChild: number,
  priceInfant: number,
  duration: number,
  direct: boolean,
  flightNumber: string,
  taxRate?: number,
  totalSeats: number,
}