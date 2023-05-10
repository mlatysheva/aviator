import { createAction, props } from '@ngrx/store';
import { IAgeTypeQuantity } from '../../avia/models/agetype-quantity.model';

export const setSelectedTrip = createAction(
  '[Flight Select] Set Selected Trip',
  props<{
    roundTrip: boolean;
    originCity: string;
    destinationCity: string;
    airportsIataCodes: string[];
    outboundDepartureDate: string;
    outboundDepartureTime: string;
    outboundArrivalTime: string;
    outboundFlightNo: string;
    returnFlightNo?: string;
    returnDepartureDate?: string;
    returnDepartureTime?: string;
    returnArrivalTime?: string;
    numberOfPassengers: IAgeTypeQuantity[];
    totalAmount: number;
    totalTax: number;

  }>()
);

export const clearSelectedTrip = createAction(
  '[Flight Select] Cleared Selected Trip'
);

