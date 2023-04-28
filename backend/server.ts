import jsonServer from "json-server";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { getResolvedPath } from './utils/getResolvedPath.js';
import { fileURLToPath } from 'url';
import { generateFlights } from './utils/generateFlights.js';
import { IFlight } from './types/flight.js';

const server = jsonServer.create();
const _filename = fileURLToPath(import.meta.url);
const pathToDB = getResolvedPath(_filename, 'db.json');
const middlewares = jsonServer.defaults();
const port = 3000;
const router = jsonServer.router(pathToDB);

server.use(middlewares);
server.use(jsonServer.bodyParser);

// generateFlights();

server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.id = uuidv4();
    req.headers['content-type'] = 'application/json';
  }
  next();
});

server.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/users') {
    const { email } = req.body;
    const db = JSON.parse(
      fs.readFileSync(pathToDB, 'utf8'),
    );
    
    const { users = [] } = db;
    const userFromBd = users.find((user: any) => user.email === email);
    if (userFromBd) {
      return res.status(403).json({ message: 'User with such email already exists' });
    }
  }
  next();
});

server.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const db = JSON.parse(
      fs.readFileSync(pathToDB, 'utf8'),
    );
    
    const { users = [] } = db;
    const userFromBd = users.find(
      (user: any) => user.username === username && user.password === password,
    );

    if (userFromBd) {
      return res.json(userFromBd);
    }

    return res.status(403).json({ message: 'User not found' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message });
  }
});

server.get('/flightspair', (req, res) => {
  try {
    const { originAirportIataCode, destinationAirportIataCode } = req.body;
    const db = JSON.parse(
      fs.readFileSync(pathToDB, 'utf8'),
    );  
    const { flights = [] } = db;
    const departureFlight= flights.find(
      (flight: IFlight) => flight.originAirportIataCode === originAirportIataCode && flight.destinationAirportIataCode === destinationAirportIataCode,
    );
    const indexOfOriginalFlight = flights.indexOf(departureFlight);

    let returnFlight = null;
    if (flights[indexOfOriginalFlight + 1] && flights[indexOfOriginalFlight + 1].originAirportIataCode === destinationAirportIataCode && flights[indexOfOriginalFlight + 1].destinationAirportIataCode === originAirportIataCode) {
      returnFlight = flights[indexOfOriginalFlight + 1];
    } else if (flights[indexOfOriginalFlight - 1] && flights[indexOfOriginalFlight - 1].originAirportIataCode === destinationAirportIataCode && flights[indexOfOriginalFlight - 1].destinationAirportIataCode === originAirportIataCode) {
      returnFlight = flights[indexOfOriginalFlight - 1];
    } else {
      returnFlight = flights.find(
        (flight: IFlight) => flight.originAirportIataCode === destinationAirportIataCode && flight.destinationAirportIataCode === originAirportIataCode,
      );
    }
    
    return res.json({departureFlight, returnFlight});
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message });
  }
});

// server.use((req, res, next) => {
//   if (!req.headers.authorization) {
//     return res.status(403).json({ message: 'Authorisation failed!' });
//   }

//   next();
// });

server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on ${port}`);
});
