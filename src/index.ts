import cluster from 'cluster';
import { cpus } from 'node:os';
import process from 'node:process';
import http from 'http';
import Controller from './controller.js';
import CRUDS from './cruds.js';
import User from './entity/user.js';
import { CRUDSError } from './interface.js';

const numCPUs = cpus().length;
const mult = process.argv[2] == '--mult';

if (cluster.isPrimary && mult) {
  console.log(`Primary ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid || 0} died`);
  });
} else {
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
        .catch((err: CRUDSError) => {
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
        .catch((err: CRUDSError) => {
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
        .catch((err: CRUDSError) => {
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
        .catch((err: CRUDSError) => {
          console.log('UPDATE User:', err.message);
          res.writeHead(err.code || 404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: err.message }));
        });
    } else if (req.url === '/api/users' && req.method === 'POST') {
      CRUDS.getData(req)
        .then((user: User) => control.createUser(user))
        .then((user) => {
          console.log('CREATE User: ', user);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(user));
        })
        .catch((err: CRUDSError) => {
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
    console.log(`Listening on http://localhost:${PORT}${mult ? ` on id ${process.pid}: ` : ``}`);
  });
}
