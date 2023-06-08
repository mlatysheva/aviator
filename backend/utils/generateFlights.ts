import * as fs from 'fs';
import { getResolvedPath } from './getResolvedPath.js';
import { fileURLToPath } from 'url';
import { IFlight } from '../types/flight.js';
import { v4 as uuidv4 } from 'uuid';
import airports from '../data/airports.json' assert { type: 'json'};
import { generateRandomTime } from './generateRandomTime.js';

export const generateFlights = async () => {
  try {
    const _filename = fileURLToPath(import.meta.url);
    const flights: IFlight[] = [];
    const flightOptions = [[0, 1, 2, 3, 4, 5, 6], [1, 3, 5], [0, 2, 4, 6], [1, 3, 5, 6]];
    for (let i = 0; i < airports.length; i++) {
      const { iata_code: originAirportIataCode } = airports[i] as { iata_code: string };
      for (let j = i + 1; j < airports.length; j++) {
        const { iata_code: destinationAirportIataCode } = airports[j] as { iata_code: string };
        if (originAirportIataCode === destinationAirportIataCode) return;
        const flightNumber = Math.floor(Math.random() * 1000);
        const flight: IFlight = {
          id: uuidv4(),
          originAirportIataCode,
          destinationAirportIataCode,
          flightDays: flightOptions[Math.floor(Math.random() * flightOptions.length)],
          pricesAdult: [],
          pricesChild: [],
          pricesInfant: [],
          departureTime: generateRandomTime(),
          duration: Math.floor(Math.random() * (540 - 45) + 45),
          direct: true,
          flightNumber: `FR-${flightNumber}`,
          taxRate: 0.15,
          totalSeats: 150,
          bookedSeats: 0,
        };
        if (flight.duration > 360) {
          flight.direct = false;
          flight.totalSeats = Math.floor(Math.random() * (380 - 120)) + 120;
        } else {
          flight.totalSeats = Math.floor(Math.random() * (320 - 60)) + 60;
        }
        const priceAdult = Math.round((flight.duration * 1.2 * 10) / 10);
        const priceChild = Math.floor(priceAdult * 0.8);
        const priceInfant = Math.floor(priceAdult * 0.2);
        for (let i = 0; i < flight.flightDays.length; i++) {
          flight.pricesAdult.push(priceAdult + i * 5);
          flight.pricesChild.push(priceChild + i * 3);
          flight.pricesInfant.push(priceInfant + i * 2);
        }
        const returnFlight: IFlight = {
          id: uuidv4(),
          originAirportIataCode: flight.destinationAirportIataCode,
          destinationAirportIataCode: flight.originAirportIataCode,
          flightDays: flight.flightDays,
          pricesAdult: flight.pricesAdult.map(price => Math.floor(price * 1.1)),
          pricesChild: flight.pricesChild.map(price => Math.floor(price * 1.1)),
          pricesInfant: flight.pricesInfant.map(price => Math.floor(price * 1.1)),
          duration: Math.floor(flight.duration * 0.9),
          departureTime: generateRandomTime(),
          direct: flight.direct,
          flightNumber: `FR-${flightNumber + 1}`,
          taxRate: flight.taxRate,
          totalSeats: flight.totalSeats,
          bookedSeats: 0,
        };
        flight.returnFlightId = returnFlight.id;
        returnFlight.returnFlightId = flight.id;
        flights.push(flight);
        flights.push(returnFlight);
      }
    }
    fs.writeFileSync(getResolvedPath(_filename, '..', 'data', 'flights.json'), JSON.stringify(flights), { flag: 'w+' });
    console.log(`The file "flights.json" has been successfully written.`);
  } catch(err) {
    console.error(err);
  }
};
