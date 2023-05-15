import { IContacts } from './contacts';
import { IPassenger } from './passenger';
import { IAgeTypeQuantity } from './agetype-quantity.model';
import { IAirport } from '../models/airport';

export interface ITrip {
  id?: string;
  userId: string;
  roundTrip: boolean;
  originAiroportName: string;
  destinationAiroportName: string;
  airportsIataCodes: string[];
  originCity: string;
  destinationCity: string;
  outboundFlightNo: string;
  outboundDepartureDate: string;
  outboundDepartureTime: string;
  outboundArrivalTime: string;
  returnFlightNo?: string;
  returnDepartureDate?: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  passengers: IPassenger[];
  numberOfPassengers: IAgeTypeQuantity[];
  totalAmount: number;
  totalTax: number;
  contactDetails: IContacts;
  isPaid?: boolean;
}
