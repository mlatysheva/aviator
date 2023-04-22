import * as fs from 'fs/promises';
import { getResolvedPath } from './getResolvedPath.js';
import { fileURLToPath } from 'url';
import airports from '../data/airports.json' assert { type: 'json'};
import { IFlight } from '../types/flights.js';
import { v4 as uuidv4 } from 'uuid';

export const generateFlights = async () => {
  try {
    const _filename = fileURLToPath(import.meta.url);
    const flights: IFlight[] = [];
    airports.forEach((airport) => {
      const { iata_code: originAirportIataCode } = airport;
      airports.forEach((airport) => {
        const { iata_code: destinationAirportIataCode } = airport;
        if (originAirportIataCode === destinationAirportIataCode) return;
        const flight: IFlight = {
          id: uuidv4(),
          originAirportIataCode,
          destinationAirportIataCode,
          priceAdult: 0,
          priceChild: 0,
          priceInfant: 0,
          duration: Math.floor(Math.random() * (540 - 45) + 45),
          direct: true,
          flightNumber: `FR-${Math.floor(Math.random() * 1000).toString()}`,
          taxRate: 0.15,
          totalSeats: 150,
        };
        if (flight.duration > 360) {
          flight.direct = false;
          flight.totalSeats = Math.floor(Math.random() * (380 - 120)) + 120;
        } else {
          flight.totalSeats = Math.floor(Math.random() * (320 - 60)) + 60;
        }
        flight.priceAdult = Math.round((flight.duration * 1.2 * 10) / 10);
        flight.priceChild = Math.floor(flight.priceAdult * 0.8);
        flight.priceInfant = Math.floor(flight.priceAdult * 0.2);
        flights.push(flight);
      });
    });
    await fs.writeFile(getResolvedPath(_filename, '..', 'data', 'flights.json'), JSON.stringify(flights), { flag: 'w+' });
    console.log(`The file "flights.json" has been successfully written.`);
  } catch(err) {
    console.error(err);
  }
};
