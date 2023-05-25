import { Injectable } from '@angular/core';
import * as cityTimezones from 'city-timezones';
import * as timeOffset from 'countries-and-timezones';
import { IFlight } from 'src/app/models/flight';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  addOneDay(date: string | undefined) {
    if (date === undefined) {
      return new Date().toISOString().slice(0, -1);
    }
    const dateCopy = new Date(date);
    dateCopy.setDate(dateCopy.getDate() + 1);
    return dateCopy.toString();
  }

  minusOneDay(date: string | undefined) {
    if (date === undefined) {
      return new Date().toISOString().slice(0, -1);
    }
    const dateCopy = new Date(date);
    dateCopy.setDate(dateCopy.getDate() - 1);
    return dateCopy.toString();
  }

  isCanFly(date: string) {
    const dateCopy = new Date(date);
    const today = new Date();
    return dateCopy < today;
  }

  isFlightDay(date: string, flight: IFlight['flightDays']) {
    if (flight === undefined || date === undefined || flight.length === 0) {
      return false;
    }
    const dateCopy = new Date(date);
    const day = dateCopy.getDay();
    if (flight !== undefined && flight !== undefined && date !== undefined) {
      const index = flight.indexOf(day);
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

  dateSlideTo(date: string | undefined) {
    const today = date;
    const yesterday = this.minusOneDay(today);
    const dayBeforeYesterday = this.minusOneDay(yesterday);
    const twoDaysBeforeYesterday = this.minusOneDay(dayBeforeYesterday);
    const tomorrow = this.addOneDay(today);
    const dayAfterTomorrow = this.addOneDay(tomorrow);
    const twoDaysAfterTomorrow = this.addOneDay(dayAfterTomorrow);
    const threeDaysAfterTomorrow = this.addOneDay(twoDaysAfterTomorrow);

    const slide = [
      twoDaysBeforeYesterday,
      yesterday,
      today,
      tomorrow,
      dayAfterTomorrow,
      twoDaysAfterTomorrow,
      threeDaysAfterTomorrow,
    ]
    slide.forEach((item) => {
      const departureDate = item;
      return departureDate;
    }
    );
    return slide;
  }

  getArrivingDate(departureDate: string | undefined, departureTime: string, duration: number): { dateToRender: string, timeToRender: string } {

    if (departureDate === undefined) {
      return { dateToRender: new Date().toDateString(), timeToRender: '00:00' };

    } if (departureTime === undefined) {
      const dateCopy = new Date(departureDate);
      const addMinutes = dateCopy.getTime() + duration * 60000;
      const arrivingDate = new Date(addMinutes);
      const dateToRender = arrivingDate.toDateString();
      const timeToRender = arrivingDate.toLocaleString('en-GB').slice(11, 17);
      return { dateToRender, timeToRender };
    }
    else {
      const dateCopy = new Date(departureDate);
      const time = departureTime?.split(':');
      if (time !== undefined && time.length === 2)
        dateCopy.setHours(+time[0]);
      dateCopy.setMinutes(+time[1]);
      const addMinutes = dateCopy.getTime() + duration * 60000;
      const arrivingDate = new Date(addMinutes);
      const dateToRender = arrivingDate.toLocaleString('en-GB', {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const timeToRender = arrivingDate.toLocaleString('en-GB').slice(11, 17);
      return { dateToRender, timeToRender };
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
    if (city !== undefined)

      if (city === '') {
        return 'Europe/Kiev';
      }
    const timeZone = cityTimezones.lookupViaCity(city);
    if (timeZone !== undefined && timeZone.length > 0)
      return timeZone[0].timezone;
    if (city === 'London') {
      return 'Greenwich Mean Time';
    }
    return 'Europe/Kiev';
  }


  findOffset(city: string): string {
    if (city !== undefined) {
      const zone = this.findTimeZone(city);
      const timezone = timeOffset.getTimezone(zone);
      if (timezone !== null) {
        return timezone.utcOffsetStr;
      }
    }
    return '+00:00';
  }

  dateToLocaleString(date: string) {
    const dateCopy = new Date(date);
    return dateCopy.toLocaleString('en-GB', {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

}
