import { IContacts } from './contacts';
import { IPassenger } from './passenger';
import { IAgeTypeQuantity } from '../avia/models/agetype-quantity.model';

export interface ITrip {
  id?: string;
  userId: string;
  roundTrip: boolean;
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
}
