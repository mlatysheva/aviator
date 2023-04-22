import jsonServer from "json-server";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { getResolvedPath } from './utils/getResolvedPath.js';
import { fileURLToPath } from 'url';
import { generateFlights } from './utils/generateFlights.js';

const server = jsonServer.create();
const _filename = fileURLToPath(import.meta.url);
const pathToDB = getResolvedPath(_filename, 'db.json');
const db = JSON.parse(
  fs.readFileSync(pathToDB, 'utf8'),
);

const middlewares = jsonServer.defaults();
const port = 3000;
const router = jsonServer.router(pathToDB);

server.use(middlewares);
server.use(jsonServer.bodyParser);

// generateFlights();

// To imitate an actual API from which information comes with a delay
// server.use(async (req, res, next) => {
//   await new Promise((res) => {
//     setTimeout(res, 800);
//   });
//   next();
// });

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
    const { users = [] } = db;
    const userFromBd = users.find((user: any) => user.email === email);
    if (userFromBd) {
      return res.status(403).json({ message: 'User already exists' });
    }
  }
  next();
});



server.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
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

// server.post('/users', (req, res) => {
//   try {
//     const { email } = req.body;
//     const { users = [] } = db;
//     const userFromBd = users.find((user: any) => user.email === email);
//     if (userFromBd) {
//       return res.status(403).json({ message: 'User already exists' });
//     }
//     const newUser =  JSON.stringify(req.body);
//     // res.end(newUser);
//     return res.status(200).json(newUser);
//   } catch (error) {
//     res.end(JSON.stringify({ message: `Error creating user: ${error}` }));
//   }
// });

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
