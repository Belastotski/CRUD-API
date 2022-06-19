import dotenv from 'dotenv';
import { CRUDTester } from './CRUDTester.js';
import User from './entity/user.js';
dotenv.config();
const PORT = process.env.PORT || 5000;

const user = JSON.stringify({
  username: 'Papa',
  age: 30,
  hobbies: ['flying', 'swimming'],
});

const toString = (user: User): string => {
  return JSON.stringify(user);
};

const getUser = (body: string): User => {
  return JSON.parse(body) as User;
};

const tester = new CRUDTester('localhost', PORT);
await tester.test('GET', '/api/users', null, 200, '[]').then(({ pass, message }) => {
  console.log(`Test GET ALL users is ${pass ? 'pass' : 'failed'}`);
  if (!pass) console.log(message);
});
await tester
  .test('POST', '/api/users', user, 201)
  .then(({ pass, body }) => {
    const user = getUser(body);
    if (User.isValid(user) && pass) {
      console.log(`Test Create user is pass`);
      return user;
    } else {
      console.log(`Test Create user is failed`);
      return null;
    }
  })
  .then((user) => {
    if (!user) return null;
    return tester.test('GET', `/api/users/${user.id}`, null, 200, toString(user));
  })
  .then((res) => {
    if (!res) return null;
    const { pass, message } = res;
    console.log(`Test GET user by id is ${pass ? 'pass' : 'failed'}`);
    if (!pass) console.log(message);
    return res;
  })
  .then((res) => {
    if (!res) return null;
    const { body } = res;
    const user = getUser(body);
    user.age = 35;
    return tester.test('PUT', `/api/users/${user.id}`, toString(user), 200);
  })
  .then((res) => {
    if (!res) return null;
    const { body, pass } = res;
    const user = getUser(body);
    if (pass && user.age === 35 && User.isValid(user)) {
      console.log(`Test Update user is pass`);
      return user;
    } else {
      console.log(`Test Update user is failed`);
      return null;
    }
  })
  .then((res) => {
    if (!res) return null;
    const user = res;
    return tester.test('DELETE', `/api/users/${user.id}`, null, 204, '');
  })
  .then((res) => {
    if (!res) return null;
    const { pass, message } = res;
    console.log(`Test Delete user is ${pass ? 'pass' : 'failed'}`);
    if (!pass) console.log(message);
    return pass;
  })
  .then((res) => {
    if (!res) return null;
    return tester.test('GET', '/api/users', null, 200, '[]');
  })
  .then((res) => {
    if (!res) return null;
    const { pass, message } = res;
    console.log(`Test GET ALL users is ${pass ? 'pass' : 'failed'}`);
    if (!pass) console.log(message);
  });
