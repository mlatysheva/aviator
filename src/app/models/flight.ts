export interface IFlight {
  id?: string,
  date?: Date,
  originAirportIataCode: string,
  destinationAirportIataCode: string,
  returnFlightId: string,
  duration: number,
  departureTime: string,
  direct: boolean,
  flightNumber: string,
  flightDays: number[],
  totalSeats: number,
  bookedSeats: number,
  pricesAdult: number[],
  pricesChild: number[],
  pricesInfant: number[],
  taxRate?: number,
}
