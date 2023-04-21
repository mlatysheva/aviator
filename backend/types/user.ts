import { IContacts } from './contacts';
import { ICurrency } from './currenty';
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
  contacts?: IContacts;
  currency?: ICurrency;
  dateFormat?: IDateFormat;
}