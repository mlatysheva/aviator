import { IGender } from './gender';

export interface IPassenger {
  id?: string;
  firstName: string;
  lastName: string;
  birthday: string;
  age?: number;
  ageCategory: IAgeCategory;
  seatNo?: string;
  gender: IGender;
}

export enum IAgeCategory {
  adult = 'adult',
  child = 'child',
  infant = 'infant',
}
