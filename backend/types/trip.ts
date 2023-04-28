import { IContacts } from './contacts';
import { IFlight } from './flight';

export interface ITrip {
  id?: string;
  userId: string;
  roundTrip: boolean;
  departureDate: Date;  
  returnDate?: Date;
  outboundSegments: IFlight[];
  inboundSegments?: IFlight[];
  passengersIds: string[];
  totalAmount: number;
  totalTax: number;
  contactDetails: IContacts;
  promoCode?: string;
}