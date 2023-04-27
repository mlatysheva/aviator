import { IAgeTypeQuantity } from './agetype-quantity.model';

export interface ISearchForm {
  tripType: string;
  departure: string;
  destination: string;
  startDate: string;
  endDate: string;
  passengers: IAgeTypeQuantity[];
}
