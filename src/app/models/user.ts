import { IContacts } from './contacts';
import { ICurrency } from './currency';
import { IDateFormat } from './dateFormat';
import { IGender } from './gender';

export interface IUser {
  id?: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  birthday?: string;
  gender?: IGender;
  contactDetails?: IContacts;
  currency?: ICurrency;
  dateFormat?: IDateFormat;
  cartsIds?: string[];
  tripsIds?: string[];
  citizenship?: string;
  promoCode?: string;
  isCodeApplied?: boolean;
}
