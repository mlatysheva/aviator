import { Injectable } from '@angular/core';
import * as cityTimezones from 'city-timezones';
import * as timeOffset from 'countries-and-timezones';
import { IFlight } from 'src/app/models/flight';

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

  isFlightDay(date: string, flight: IFlight) {
    if (flight === undefined || date === undefined || flight.flightDays === undefined) {
      return false;
    }
    const dateCopy = new Date(date);
    const day = dateCopy.getDay();
    if (flight !== undefined && flight.flightDays !== undefined && date !== undefined) {
      const index = flight.flightDays.indexOf(day);
      if (index !== -1) {
        return true;
      }
    }
    return false;
  }

  getIndexOfDate(date: string, flightDays: number[]) {
    const dateCopy = new Date(date);
    const day = dateCopy.getDay();
    const index = flightDays.indexOf(day);
    if (index === -1) {
      return -1;
    }
    return index;
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

  getArrivingDate(departureDate: string, departureTime: string, duration: number): string {
    if (departureDate === undefined) {
      return new Date().toISOString().slice(0, -1);
    } else {
      const dateCopy = new Date(departureDate);
      const time = departureTime.split(':');
      dateCopy.setHours(+time[0]);
      dateCopy.setMinutes(+time[1]);
      const addMinutes = dateCopy.getTime() + duration * 60000;
      const arrivingDate = new Date(addMinutes);
      return arrivingDate.toString();
    }
  }
  getDay(date: string) {
    const dateCopy = new Date(date);
    return dateCopy.getDay();
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
