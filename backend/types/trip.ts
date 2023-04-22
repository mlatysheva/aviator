import { IContacts } from './contacts';

export interface ITrip {
  id?: string;
  roundTrip: boolean;
  departureDate: Date;  
  returnDate?: Date;
  departureFlightId: string;
  returnFlightId?: string;
  passengersIds: string[];
  totalAmount: number;
  totalTax: number;
  contactDetails: IContacts;
  promoCode?: string;
}