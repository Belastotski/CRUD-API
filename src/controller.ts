import User from './entity/user.js';
import UsersDB from './userdb.js';
import { NotFindError, ParametrsError } from './errors.js';

export default class Controller {
  async getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      resolve(Array.from(UsersDB.users.values()));
      reject();
    });
  }

  async getUser(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!User.validId(id)) reject(new ParametrsError());
      const user: User | undefined = UsersDB.users.get(id);
      if (user) resolve(user);
      else reject(new NotFindError('User'));
    });
  }

  async createUser(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!user) reject(new ParametrsError());
      if (User.isValid(user)) {
        const newUser = new User(user);
        UsersDB.users.set(newUser.id, newUser);
        resolve(newUser);
      } else reject(new ParametrsError('Not contain required fields'));
    });
  }

  async updateUser(id: string, updateUser: User): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!User.validId(id)) reject(new ParametrsError());
      const user = UsersDB.users.get(id);
      if (!user) {
        reject(new NotFindError('User'));
      } else {
        user.update(updateUser);
        UsersDB.users.set(user.id, user);
        resolve(user);
      }
    });
  }

  async deleteUser(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!User.validId(id)) reject(new ParametrsError());
      const user = UsersDB.users.get(id);
      if (!user) reject(new NotFindError('User'));
      else {
        UsersDB.users.delete(id);
        resolve(user);
      }
    });
  }
}
