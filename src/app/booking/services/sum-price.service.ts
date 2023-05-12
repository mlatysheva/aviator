import { Injectable } from '@angular/core';
import { IAgeTypeQuantity } from '../../models/agetype-quantity.model';
import { IFlight } from '../../models/flight';

@Injectable({
  providedIn: 'root'
})

export class SumPriceService {
  sumpPricesAdult(flight: IFlight, passengers: IAgeTypeQuantity[]): { adultPrice: number, childPrice: number, infantPrice: number, sumPrice: number, totalTax?: number } {
    const pricesAdult = flight.pricesAdult[0];
    const pricesChild = flight.pricesChild[0];
    const pricesInfant = flight.pricesInfant[0];
    const adultPassengers = passengers.filter(p => p.ageCategory === 'adult');
    const childPassengers = passengers.filter(p => p.ageCategory === 'child');
    const infantPassengers = passengers.filter(p => p.ageCategory === 'infant');
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
