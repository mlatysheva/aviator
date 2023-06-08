import { IContacts } from './contacts';
import { IPassenger } from './passenger';
import { IAgeTypeQuantity } from './agetype-quantity.model';


export interface ITrip {
  id?: string;
  userId: string;
  roundTrip: boolean;
  originAiroportName: string;
  destinationAiroportName: string;
  airportsIataCodeOrigin: string;
  airportsIataCodeDestination: string;
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
  totalAmount: ITotalAmount;
  totalTax: number;
  totalAmountFrom?: ITotalAmount;
  totalTaxFrom?: number;
  totalCalculatedAmount?: number;
  contactDetails: IContacts;
  isPaid: boolean;
}

export interface ITotalAmount {
  adultPrice: number;
  childPrice: number;
  infantPrice: number;
  sumPrice: number;
  totalTax: number;
}
