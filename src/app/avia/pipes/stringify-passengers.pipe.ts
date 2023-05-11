import { Pipe, PipeTransform } from '@angular/core';
import { IAgeTypeQuantity } from '../../models/agetype-quantity.model';

@Pipe({
  name: 'stringifyPassengers',
  pure: false,
})
export class StringifyPassengersPipe implements PipeTransform {
  transform(passengers: IAgeTypeQuantity[]): string {
    let passengersValue = '';

    passengers.forEach((passenger) => {
      passengersValue +=
        passenger.quantity + ' ' + passenger.ageCategory + ', ';
    });

    return passengersValue.slice(0, -2);
  }
}
