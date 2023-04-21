import jsonServer from "json-server";
import data from "./db.json";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const server = jsonServer.create();

const middlewares = jsonServer.defaults();
const port = 3000;
const router = jsonServer.router(data);

server.use(middlewares);
server.use(jsonServer.bodyParser);

// To imitate an actual API from which information comes with a delay
server.use(async (req, res, next) => {
  await new Promise((res) => {
    setTimeout(res, 800);
  });
  next();
});

server.use((req, res, next) => {
  console.dir(data.users);
  if (req.method === 'POST') {
    req.body.id = uuidv4();
    req.headers['content-type'] = 'application/json';
  }
  next();
});


server.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const users = data.users;

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
//     req.body.id = uuidv4();
    
//     res.writeHead(201, { 'Content-Type': 'application/json' });
//     const newUser =  JSON.stringify(req.body);
//     res.end(newUser);
//     fs.writeFileSync('./data/users.json', JSON.stringify([...data.users, req.body]));

//     return newUser;
//   } catch (error) {
//     res.writeHead(500, { 'Content-Type': 'application/json' });
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
