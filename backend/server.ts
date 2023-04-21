import jsonServer from "json-server";
import data from "./mockData";

const server = jsonServer.create();
const router = jsonServer.router(data);
const middlewares = jsonServer.defaults();
const port = 3000;

server.use(middlewares);
server.use(jsonServer.bodyParser);

// To imitate an actual API from which information comes with a delay
server.use(async (req, res, next) => {
  await new Promise((res) => {
    setTimeout(res, 800);
  });
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