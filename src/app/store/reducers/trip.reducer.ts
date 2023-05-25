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
  airportsIataCodeOrigin: string;
  airportsIataCodeDestination: string;
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
  totalAmountFrom?: { adultPrice: number; childPrice: number; infantPrice: number; sumPrice: number; totalTax?: number | undefined; }
  totalCalculatedAmount: number;
  contactDetails: IContacts;
  numberOfPassengers: IAgeTypeQuantity[];
  isPaid?: boolean;
  duration: number;
  durationFrom: number;
  seatsFrom: number;
  seatsTo: number;
  flightDaysTo: number[];
  flightDaysFrom: number[];
}

export const initialState: TripState = {
  id: '',
  userId: '',
  roundTrip: true,
  airportsIataCodeOrigin: '',
  airportsIataCodeDestination: '',
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
  totalAmountFrom: { adultPrice: 0, childPrice: 0, infantPrice: 0, sumPrice: 0, totalTax: 0 },
  totalCalculatedAmount: 0,
  contactDetails: {
    countryCode: '+0',
    phone: '',
  },
  isPaid: false,
  duration: 0,
  durationFrom: 0,
  seatsTo: 0,
  seatsFrom: 0,
  flightDaysTo: [],
  flightDaysFrom: [],
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
    SelectedActions.setSelectedTripDuration,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedTripDurationFrom,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),


  on(
    SelectedActions.setSelectedOutboundDepartureTime,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedReturnDepartureTime,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedOutboundArrivalTime,
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
    SelectedActions.setSelectedAiroportCodeOrigin,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedAiroportCodeDestination,
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
    SelectedActions.setSelectedTripSeatsFrom,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedTripSeatsTo,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedFlightDaysTo,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    SelectedActions.setSelectedFlightDaysFrom,
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
  on(SelectedActions.setTotalCalculatedAmount, (state, payload): TripState => ({
    ...state,
    ...payload,
  })),
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
      totalAmountFrom: { adultPrice: 0, childPrice: 0, infantPrice: 0, sumPrice: 0, totalTax: 0 },
      totalCalculatedAmount: 0,
      flightDaysTo: [],
      flightDaysFrom: [],
      seatsFrom: 0,
      seatsTo: 0,
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
    TripActions.setNumberOfPassengers,
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
  on(
    TripActions.setTripId,
    (state, payload): TripState => ({
      ...state,
      ...payload,
    })
  ),
  on(
    TripActions.setUserId,
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
    airportsIataCodeOrigin: '',
    airportsIataCodeDestination: '',
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
    totalAmountFrom: { adultPrice: 0, childPrice: 0, infantPrice: 0, sumPrice: 0, totalTax: 0 },
    totalCalculatedAmount: 0,
    contactDetails: {
      countryCode: '+0',
      phone: '',
    },
    isPaid: false,
    duration: 0,
    flightDaysFrom: [],
    flightDaysTo: [],
    seatsFrom: 0,
    seatsTo: 0,
  }))
);
