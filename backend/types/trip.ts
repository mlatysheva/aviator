import { IContacts } from './contacts';
import { IPassenger } from './passenger';
import { IFlight } from './flights';

export interface ITrip {
  id?: string;
  roundTrip: boolean;
  departureDate: Date;  
  returnDate?: Date;
  outboundSegments: IFlight[];
  inboundSegments?: IFlight[];
  passengers: IPassenger[];
  totalAmount: number;
  totalTax: number;
  contactDetails: IContacts;
  promoCode?: string;
}