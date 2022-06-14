import { v4, validate } from 'uuid';
import { NotFindError, ParametrsError } from './errors.js';
import User from './interface.js';

export default class Controller {
  private users: Map<string, User> = new Map();

  async getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      resolve(Array.from(this.users.values()));
      reject();
    });
  }

  async getUser(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!validate(id)) reject(new ParametrsError());
      const user: User | undefined = this.users.get(id);
      if (user) resolve(user);
      else reject(new NotFindError('User'));
    });
  }

  async createUser(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!user) reject(new ParametrsError());
      const newUser = {
        ...user,
        id: v4(),
      };
      if (newUser.id && newUser.age && newUser.username && newUser.hobbies && Array.isArray(newUser.hobbies)) {
        this.users.set(newUser.id, newUser);
        resolve(newUser);
      } else reject(new ParametrsError('Not contain required fields'));
    });
  }

  async updateUser(id: string, updateUser: User): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!validate(id)) reject(new ParametrsError());
      let user = this.users.get(id);
      if (!user) {
        reject(new NotFindError('User'));
      } else {
        user = { ...user, ...updateUser, id: user.id };
        this.users.set(user.id, user);
        resolve(user);
      }
    });
  }

  async deleteUser(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!validate(id)) reject(new ParametrsError());
      const user = this.users.get(id);
      if (!user) reject(new NotFindError('User'));
      else {
        this.users.delete(id);
        resolve(user);
      }
    });
  }
}
