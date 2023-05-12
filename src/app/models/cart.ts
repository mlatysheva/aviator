import { ITrip } from './trip';

export interface ICart {
  id?: string;
  userId: string;
  tripsIds?: string[];
  trips?: ITrip[];
  promoCode?: string;
  isCodeApplied?: boolean;
}