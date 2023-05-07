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
    const today = date;
    const tomorrow = this.addOneDay(today);
    const dayAfterTomorrow = this.addOneDay(tomorrow);
    const twoDaysAfterTomorrow = this.addOneDay(dayAfterTomorrow);
    const yesterday = this.minusOneDay(today);
    const dayBeforeYesterday = this.minusOneDay(yesterday);
    const twoDaysBeforeYesterday = this.minusOneDay(dayBeforeYesterday);

    const slide = [
      twoDaysBeforeYesterday,
      dayBeforeYesterday,
      yesterday,
      today,
      tomorrow,
      dayAfterTomorrow,
      twoDaysAfterTomorrow
    ]
    slide.forEach((item) => {
      const departureDate = item;
      return departureDate;
    }
    );
    return slide;
  }

  getArrivingDate(departureDate: string, duration: number): string | undefined {
    if (departureDate === undefined) {
      return new Date().toString();
    } else {
      const dateCopy = new Date(departureDate);
      const addMinutes = dateCopy.getTime() + duration * 60000;
      const arrivingDate = new Date(addMinutes);
      console.log(departureDate, duration, arrivingDate)
      return arrivingDate.toISOString().slice(0, -1);
    }
  }

  getMinutes(duration: number) {
    return duration % 60;
  }
  getHours(duration: number) {
    return Math.floor(duration / 60);
  }
  findTimeZone(city: string) {
    if (city === '') {
      return 'Europe/Kiev';
    }
    const timeZone = cityTimezones.lookupViaCity(city);
    if (city === 'London') {
      return 'Greenwich Mean Time';
    }
    return timeZone[0].timezone;
  }
  findOffset(city: string): string | undefined {
    const zone = this.findTimeZone(city);
    const timezone = timeOffset.getTimezone(zone);
    return timezone?.utcOffsetStr;
  }


}
