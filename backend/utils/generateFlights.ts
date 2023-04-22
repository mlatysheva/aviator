import * as fs from 'fs';
import { getResolvedPath } from './getResolvedPath.js';
import { fileURLToPath } from 'url';
import { IFlight } from '../types/flight.js';
import { v4 as uuidv4 } from 'uuid';
import airports from '../data/airports.json' assert { type: 'json'};

export const generateFlights = async () => {
  try {
    const _filename = fileURLToPath(import.meta.url);
    const flights: IFlight[] = [];
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
          priceAdult: 0,
          priceChild: 0,
          priceInfant: 0,
          duration: Math.floor(Math.random() * (540 - 45) + 45),
          direct: true,
          flightNumber: `FR-${flightNumber}`,
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
        const returnFlight: IFlight = {
          id: uuidv4(),
          originAirportIataCode: flight.destinationAirportIataCode,
          destinationAirportIataCode: flight.originAirportIataCode,
          priceAdult: Math.floor(flight.priceAdult * 0.8),
          priceChild: Math.floor(flight.priceChild * 0.8),
          priceInfant: Math.floor(flight.priceInfant * 0.8),
          duration: Math.floor(flight.duration * 0.9),
          direct: flight.direct,
          flightNumber: `FR-${flightNumber + 1}`,
          taxRate: flight.taxRate,
          totalSeats: flight.totalSeats,
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
