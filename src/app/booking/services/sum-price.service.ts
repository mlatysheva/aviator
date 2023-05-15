import { Injectable } from '@angular/core';
import { IAgeTypeQuantity } from '../../models/agetype-quantity.model';
import { IFlight } from '../../models/flight';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SumPriceService {
  public passengersWithFareAndTax$ = new BehaviorSubject<IAgeTypeQuantity[]>(
    []
  );

  sumpPricesAdult(
    flight: IFlight,
    passengers: IAgeTypeQuantity[]
  ): {
    adultPrice: number;
    childPrice: number;
    infantPrice: number;
    sumPrice: number;
    totalTax?: number;
  } {
    const pricesAdult = flight.pricesAdult[0];
    const pricesChild = flight.pricesChild[0];
    const pricesInfant = flight.pricesInfant[0];
    const passengersFaresAndTaxesArray = this.getPassengersWithPrices(
      flight,
      passengers,
      pricesAdult,
      pricesChild,
      pricesInfant
    );
    this.passengersWithFareAndTax$.next(passengersFaresAndTaxesArray);
    const adultPassengers = passengers.filter((p) => p.ageCategory === 'adult');
    const childPassengers = passengers.filter((p) => p.ageCategory === 'child');
    const infantPassengers = passengers.filter(
      (p) => p.ageCategory === 'infant'
    );
    const adultPrice = pricesAdult * adultPassengers[0].quantity;
    const childPrice = pricesChild * childPassengers[0].quantity;
    const infantPrice = pricesInfant * infantPassengers[0].quantity;
    const sumPrice = adultPrice + childPrice + infantPrice;
    if (flight.taxRate === undefined) {
      return { adultPrice, childPrice, infantPrice, sumPrice };
    }

    const totalTax = Number((sumPrice * flight.taxRate).toFixed(2));
    return { adultPrice, childPrice, infantPrice, sumPrice, totalTax };
  }

  getFareAndTax(
    flight: IFlight,
    passenger: IAgeTypeQuantity,
    priceAdult: number,
    priceChild: number,
    priceInfant: number
  ): any {
    if (passenger.ageCategory === 'adult') {
      return {
        fare: priceAdult,
        tax: flight.taxRate
          ? Number((priceAdult * flight.taxRate).toFixed(2))
          : undefined,
      };
    } else if (passenger.ageCategory === 'child') {
      return {
        fare: priceChild,
        tax: flight.taxRate
          ? Number((priceChild * flight.taxRate).toFixed(2))
          : undefined,
      };
    } else if (passenger.ageCategory === 'infant') {
      return {
        fare: priceInfant,
        tax: flight.taxRate
          ? Number((priceInfant * flight.taxRate).toFixed(2))
          : undefined,
      };
    }
  }

  getPassengersWithPrices(
    flight: IFlight,
    passengers: IAgeTypeQuantity[],
    priceAdult: number,
    priceChild: number,
    priceInfant: number
  ): IAgeTypeQuantity[] {
    passengers = passengers.map((passenger) => ({
      ...passenger,
      ...this.getFareAndTax(
        flight,
        passenger,
        priceAdult,
        priceChild,
        priceInfant
      ),
    }));
    return passengers;
  }
}
