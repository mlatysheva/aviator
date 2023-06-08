import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'airportValue',
})
export class AirportValuePipe implements PipeTransform {
  transform(airport: string): string {
    const airportArray = airport.split(',');
    airportArray.splice(0, 1).join('');
    return airportArray.join('');
  }
}
