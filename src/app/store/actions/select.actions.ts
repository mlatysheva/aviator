import { createAction, props } from '@ngrx/store';
import { IAgeTypeQuantity } from '../../models/agetype-quantity.model';

export const setSelectedTrip = createAction(
  '[Flight Select] Set Selected Trip',
  props<{
    roundTrip: boolean;
    originCity: string;
    destinationCity: string;
    originAiroportName: string;
    destinationAiroportName?: string;
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

  }>()
);

export const clearSelectedTrip = createAction(
  '[Flight Select] Cleared Selected Trip'
);

export const setSelectedDepartureDate = createAction(
  '[Flight Select] Set Selected Departure Date',
  props<{ outboundDepartureDate: string }>()
);

export const setSelectedReturnDate = createAction(
  '[Flight Select] Set Selected Return Date',
  props<{ returnDepartureDate: string }>()
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
export const setSelectedAiroports = createAction(
  '[Flight Select] Set Selected Airoports',
  props<{ airportsIataCodes: string[] }>()
);
export const setSelectedOriginAiroportName = createAction(
  '[Flight Select] Set Selected Origin Airoport Name',
  props<{ originAiroportName: string }>()
);
export const setSelectedDestinationAiroportName = createAction(
  '[Flight Select] Set Selected Destination Airoport Name',
  props<{ destinationAiroportName: string }>()
);
export const setSelectedOutboundDepartureTime = createAction(
  '[Flight Select] Set Selected Outbound Departure Time',
  props<{ outboundDepartureTime: string }>()
);
export const setSelectedOutboundArrivalTime = createAction(
  '[Flight Select] Set Selected Outbound Arrival Time',
  props<{ outboundArrivalTime: string }>()
);
export const setSelectedOutboundFlightNo = createAction(
  '[Flight Select] Set Selected Outbound Flight No',
  props<{ outboundFlightNo: string }>()
);

export const setSelectedReturnDepartureTime = createAction(
  '[Flight Select] Set Selected Return Departure Time',
  props<{ returnDepartureTime: string }>()
);
export const setSelectedReturnArrivalTime = createAction(
  '[Flight Select] Set Selected Return Arrival Time',
  props<{ returnArrivalTime: string }>()
);
export const setSelectedReturnFlightNo = createAction(
  '[Flight Select] Set Selected Return Flight No',
  props<{ returnFlightNo: string }>()
);
export const setSelectedNumberOfPassengers = createAction(
  '[Flight Select] Set Selected Number Of Passengers',
  props<{ numberOfPassengers: IAgeTypeQuantity[] }>()
);
export const setSelectedTotalAmount = createAction(
  '[Flight Select] Set Selected Total Amount',
  props<{ totalAmount: { adultPrice: number; childPrice: number; infantPrice: number; sumPrice: number; totalTax?: number | undefined; } }>()
);
export const setSelectedTotalAmountFrom = createAction(
  '[Flight Select] Set Selected Total Amount From',
  props<{ totalAmountFrom: { adultPrice: number; childPrice: number; infantPrice: number; sumPrice: number; totalTax?: number | undefined; } }>()
);
export const setTotalCalculatedAmount = createAction(
  '[Flight Select] Set Total Calculated Amount',
  props<{ totalCalculatedAmount: number }>()
);
export const setSelectedTripId = createAction(
  '[Flight Select] Set Selected Trip id',
  props<{ id: string }>()
);

export const setSelectedUserId = createAction(
  '[Flight Select] Set Selected User id',
  props<{ userId: string }>()
);



