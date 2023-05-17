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

  sumpPrices(
    flight: IFlight,
    passengers: IAgeTypeQuantity[],
    index: number
  ): {
    adultPrice: number;
    childPrice: number;
    infantPrice: number;
    sumPrice: number;
    totalTax?: number;
  } {
    if (flight === undefined || passengers === undefined || index === undefined) return { adultPrice: 0, childPrice: 0, infantPrice: 0, sumPrice: 0, totalTax: 0 };
    const pricesAdult = flight.pricesAdult[index];
    const pricesChild = flight.pricesChild[index];
    const pricesInfant = flight.pricesInfant[index];
    const passengersFaresAndTaxesArray = this.getPassengersWithPrices(
      flight,
      passengers,
      pricesAdult,
      pricesChild,
      pricesInfant
    );
    this.passengersWithFareAndTax$.next(passengersFaresAndTaxesArray);
    const adultPassengers = passengers?.filter(
      (p) => p.ageCategory === 'adult'
    );
    const childPassengers = passengers?.filter(
      (p) => p.ageCategory === 'child'
    );
    const infantPassengers = passengers?.filter(
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
    if (flight === undefined ||
      passenger === undefined ||
      priceAdult === undefined ||
      priceChild === undefined ||
      priceInfant === undefined ||
      flight.taxRate === undefined) return { fare: 0, tax: 0 };
    if (passenger.ageCategory === 'adult') {
      return {
        fare: priceAdult,
        tax: Number((priceAdult * flight.taxRate).toFixed(2))

      };
    } else if (passenger.ageCategory === 'child') {
      return {
        fare: priceChild,
        tax: Number((priceChild * flight.taxRate).toFixed(2)),

      };
    } else if (passenger.ageCategory === 'infant') {
      return {
        fare: priceInfant,
        tax: Number((priceInfant * flight.taxRate).toFixed(2)),
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
    passengers = passengers?.map((passenger) => ({
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
