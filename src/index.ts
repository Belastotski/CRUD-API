/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
import http from 'http';
import Controller from './controller.js';
import CRUDS from './cruds.js';

const PORT = process.env.PORT || 5000;

const control = new Controller();

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  console.log(req.url);
  if (req.url === '/api/users' && req.method === 'GET') {
    control
      .getUsers()
      .then((users) => {
        console.log('GET Users: ', users);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
      })
      .catch((err) => {
        console.log('GET Users: ', err.message);
        res.writeHead(err.code || 404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
      });
  } else if (req.url?.match(/\/api\/users\/([0-9a-z-]+)/) && req.method === 'GET') {
    CRUDS.getId(req)
      .then((id) => control.getUser(id))
      .then((user) => {
        console.log('GET User: ', user);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      })
      .catch((err) => {
        console.log('GET User: ', err.message);
        res.writeHead(err.code || 404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
      });
  } else if (req.url?.match(/\/api\/users\/([0-9a-z-]+)/) && req.method === 'DELETE') {
    CRUDS.getId(req)
      .then((id) => control.deleteUser(id))
      .then((user) => {
        console.log('DELETE User: ', user);
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      })
      .catch((err) => {
        console.log('DELETE User:', err.message);
        res.writeHead(err.code || 500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
      });
  } else if (req.url?.match(/\/api\/users\/([0-9a-z-]+)/) && req.method === 'PUT') {
    CRUDS.getId(req)
      .then(async (id) => ({ id, user: await CRUDS.getData(req) }))
      .then(({ id, user }) => control.updateUser(id, user))
      .then((user) => {
        console.log('UPDATE User: ', user);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      })
      .catch((err) => {
        console.log('UPDATE User:', err.message);
        res.writeHead(err.code || 404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
      });
  } else if (req.url === '/api/users' && req.method === 'POST') {
    CRUDS.getData(req)
      .then((user) => control.createUser(user))
      .then((user) => {
        console.log('CREATE User: ', user);
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      })
      .catch((err) => {
        console.log('CREATE User:', err.message);
        res.writeHead(err.code || 404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
      });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not found page' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
