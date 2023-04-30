import { Injectable } from '@angular/core';
import * as cityTimezones from 'city-timezones';
import * as timeOffset from 'countries-and-timezones';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  addOneDay(date: string) {
    const dateCopy = new Date(date);
    dateCopy.setDate(dateCopy.getDate() + 1);
    return dateCopy.toString();
  }

  minusOneDay(date: string) {
    const dateCopy = new Date(date);
    dateCopy.setDate(dateCopy.getDate() - 1);
    return dateCopy.toString();
  }

  isCanFly(date: string) {
    const dateCopy = new Date(date);
    const today = new Date();
    return dateCopy < today;
  }

  dateSlideTo(date: string) {
    const slide = [
      this.minusOneDay(this.minusOneDay(date)),
      this.minusOneDay(date),
      date,
      this.addOneDay(date),
      this.addOneDay(this.addOneDay(date)),
    ]
    return slide;
  }

  getArrivingDate(departureDate: string, duration: number) {
    const dateCopy = new Date(departureDate);
    const addMinutes = dateCopy.getTime() + duration * 60000;
    const arrivingDate = new Date(addMinutes);
    return arrivingDate.toISOString().slice(0, -1);
  }

  getMinutes(duration: number) {
    return duration % 60;
  }
  getHours(duration: number) {
    return Math.floor(duration / 60);
  }
  findTimeZone(city: string) {
    const timeZone = cityTimezones.lookupViaCity(city);

    if (city === 'London') {
      return 'Greenwich Mean Time';
    }
    console.log(timeZone[0].timezone)
    return timeZone[0].timezone;
  }
  findOffset(city: string): string | undefined {
    const zone = this.findTimeZone(city);
    const timezone = timeOffset.getTimezone(zone);
    return timezone?.utcOffsetStr;
  }


}
