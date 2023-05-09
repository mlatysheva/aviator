import { createReducer, on } from '@ngrx/store';
import { IContacts } from 'src/app/models/contacts';
import { IPassenger } from 'src/app/models/passenger';
import * as TripActions from '../actions/trip.actions';

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
  returnFlightNo?: string;
  returnDepartureDate?: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  passengers: IPassenger[];
  totalAmount: number;
  totalTax: number;
  contactDetails: IContacts;
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
  passengers: [],
  totalAmount: 0,
  totalTax: 0,
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
    passengers: [],
    totalAmount: 0,
    totalTax: 0,
    contactDetails: {
      countryCode: '+0',
      phone: '',
    },
  }))
);
