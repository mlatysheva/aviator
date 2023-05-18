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
    if (flight === undefined || passengers === undefined || index === undefined)
      return {
        adultPrice: 0,
        childPrice: 0,
        infantPrice: 0,
        sumPrice: 0,
        totalTax: 0,
      };
    const pricesAdult = flight.pricesAdult[index];
    const pricesChild = flight.pricesChild[index];
    const pricesInfant = flight.pricesInfant[index];
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
}
