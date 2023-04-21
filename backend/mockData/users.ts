import { ICurrency } from '../types/currenty';
import { IDateFormat } from '../types/dateFormat';
import { IGender } from '../types/gender';
import { IUser } from '../types/user';

const users: IUser[] = [
  {
    "id": "1",
    "email": "email1@gmail.com",
    "password": "user321",
    "firstName": "firstName1",
    "lastName": "lastName1",
    "birthday": "01-01-2001",
    "gender": IGender.female,
    "contacts": {
      "countryCode": 7,
      "phone": "123456789",
      "email": "email1@gmail.com"
    },
    "currency": ICurrency.RUB,
    "dateFormat": IDateFormat["MM/DD/YYYY"],
  },
  {
    "id": "2",
    "email": "email2@gmail.com",
    "password": "user123",
    "firstName": "firstName2",
    "lastName": "lastName2",
    "birthday": "02-01-2001",
    "gender": IGender.male,
    "contacts": {
      "countryCode": 7,
      "phone": "987654321",
      "email": "email2@gmail.com"
    },
    "currency": ICurrency.EUR,
    "dateFormat": IDateFormat["DD/MM/YYYY"],
  },
];

export default users;
