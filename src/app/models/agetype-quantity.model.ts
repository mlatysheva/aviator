import { IAgeCategory } from 'backend/types';

export interface IAgeTypeQuantity {
  ageCategory: IAgeCategory;
  quantity: number;
  fare: number;
  tax: number | undefined;
}
