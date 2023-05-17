import { createReducer, on } from '@ngrx/store';
import { IContacts } from '../../models/contacts';
import { IPassenger } from '../../models/passenger';
import * as TripActions from '../actions/trip.actions';
import * as SelectedActions from '../actions/select.actions';
import { IAgeTypeQuantity } from '../../models/agetype-quantity.model';

export interface TripState {
  id?: string;
  userId: string;
  roundTrip: boolean;
  airportsIataCodes: string[];
  originCity: string;
  destinationCity: string;
  outboundFlightNo: string;
  outboundDepartureDate: string;
  outboundDepartureTime: string;
  outboundArrivalTime: string;
  originAiroportName: string;
  destinationAiroportName: string;
  returnFlightNo?: string;
  returnDepartureDate?: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  passengers: IPassenger[];
  totalAmount: { adultPrice: number; childPrice: number; infantPrice: number; sumPrice: number; totalTax?: number | undefined; }
  totalTax: { adultPrice: number; childPrice: number; infantPrice: number; sumPrice: number; totalTax?: number | undefined; }
  totalAmountFrom?: { adultPrice: number; childPrice: number; infantPrice: number; sumPrice: number; totalTax?: number | undefined; }
  totalTaxFrom?: { adultPrice: number; childPrice: number; infantPrice: number; sumPrice: number; totalTax?: number | undefined; }
  contactDetails: IContacts;
  numberOfPassengers: IAgeTypeQuantity[];
}

export const initialState: TripState = {
  id: '',
  userId: '',
  roundTrip: true,
  airportsIataCodes: [],
  originCity: '',
  destinationCity: '',
  outboundFlightNo: '',
  outboundDepartureDate: '',
  outboundDepartureTime: '',
  outboundArrivalTime: '',
  returnFlightNo: '',
  returnDepartureDate: '',
  returnDepartureTime: '',
  returnArrivalTime: '',
  originAiroportName: '',
  destinationAiroportName: '',
  passengers: [],
  numberOfPassengers: [],
  totalAmount: { adultPrice: 0, childPrice: 0, infantPrice: 0, sumPrice: 0, totalTax: 0 },
  totalTax: { adultPrice: 0, childPrice: 0, infantPrice: 0, sumPrice: 0, totalTax: 0 },
  totalAmountFrom: { adultPrice: 0, childPrice: 0, infantPrice: 0, sumPrice: 0, totalTax: 0 },
  totalTaxFrom: { adultPrice: 0, childPrice: 0, infantPrice: 0, sumPrice: 0, totalTax: 0 },
  contactDetails: {
    countryCode: '+0',
    phone: '',
  },
};

export const tripReducer = createReducer(
  initialState,
  on(
    TripActions.setSearchParameters,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedTrip,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedDepartureDate,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedReturnDate,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedOriginCity,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedDestinationCity,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedTripType,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedAiroports,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedOriginAiroportName,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedDestinationAiroportName,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedOutboundFlightNo,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedReturnFlightNo,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),

  on(
    SelectedActions.setSelectedTotalAmount,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedTotalTax,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedTotalAmountFrom,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedTotalTaxFrom,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),

  on(
    SelectedActions.clearSelectedTrip,
    (): TripState => ({
      ...initialState,
      outboundDepartureDate: '',
      outboundDepartureTime: '',
      outboundArrivalTime: '',
      returnDepartureDate: '',
      returnDepartureTime: '',
      returnArrivalTime: '',
      originAiroportName: '',
      destinationAiroportName: '',
      outboundFlightNo: '',
      passengers: [],
      totalAmount: { adultPrice: 0, childPrice: 0, infantPrice: 0, sumPrice: 0, totalTax: 0 },
      totalTax: { adultPrice: 0, childPrice: 0, infantPrice: 0, sumPrice: 0, totalTax: 0 },
      totalAmountFrom: { adultPrice: 0, childPrice: 0, infantPrice: 0, sumPrice: 0, totalTax: 0 },
      totalTaxFrom: { adultPrice: 0, childPrice: 0, infantPrice: 0, sumPrice: 0, totalTax: 0 },
    })
  ),
  on(
    TripActions.setPassengers,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    TripActions.setTripContactDetails,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(TripActions.clearTripState, () => ({
    ...initialState,
    id: '',
    userId: '',
    roundTrip: true,
    flightsIds: [],
    originAirportName: '',
    destinationAirportName: '',
    outboundFlightNo: '',
    outboundDepartureDate: '',
    outboundDepartureTime: '',
    outboundArrivalTime: '',
    returnFlightNo: '',
    returnDepartureDate: '',
    returnDepartureTime: '',
    returnArrivalTime: '',
    originAiroportName: '',
    destinationAiroportName: '',
    passengers: [],
    totalAmount: { adultPrice: 0, childPrice: 0, infantPrice: 0, sumPrice: 0, totalTax: 0 },
    totalTax: { adultPrice: 0, childPrice: 0, infantPrice: 0, sumPrice: 0, totalTax: 0 },
    totalAmountFrom: { adultPrice: 0, childPrice: 0, infantPrice: 0, sumPrice: 0, totalTax: 0 },
    totalTaxFrom: { adultPrice: 0, childPrice: 0, infantPrice: 0, sumPrice: 0, totalTax: 0 },
    contactDetails: {
      countryCode: '+0',
      phone: '',
    },
  }))
);
