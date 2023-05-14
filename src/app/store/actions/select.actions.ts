import { createAction, props } from '@ngrx/store';
import { IAgeTypeQuantity } from '../../models/agetype-quantity.model';

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

export const setSelectedDepartureDate = createAction(
  '[Flight Select] Set Selected Departure Date',
  props<{ departureDate: string }>()
);

export const setSelectedReturnDate = createAction(
  '[Flight Select] Set Selected Return Date',
  props<{ returnDate: string }>()
);
export const setSelectedOriginCity = createAction(
  '[Flight Select] Set Selected Origin City',
  props<{ originCity: string }>()
);
export const setSelectedDestinationCity = createAction(
  '[Flight Select] Set Selected Destination City',
  props<{ destinationCity: string }>()
);
export const setSelectedTripType = createAction(
  '[Flight Select] Set Selected Trip Type',
  props<{ roundTrip: boolean }>()
);

