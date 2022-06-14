import { v4, validate } from 'uuid';
import { NotFindError, ParametrsError } from './errors';

interface User {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
}

export default class Controller {
  private users: User[] = [];

  async getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      resolve(this.users);
      reject();
    });
  }

  async getUser(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!validate(id)) reject(new ParametrsError());
      const user: User | undefined = this.users.find((usr) => usr.id === id);
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
        this.users.push(newUser);
        resolve(newUser);
      } else reject(new ParametrsError('Not contain required fields'));
    });
  }

  async updateUser(id: string, updateUser: User): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!validate(id)) reject(new ParametrsError());
      let user = this.users.find((usr) => usr.id === id);
      if (!user) {
        reject(new NotFindError('User'));
      }
      user = { ...user, ...updateUser };
      resolve(user);
    });
  }

  async deleteUser(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!validate(id)) reject(new ParametrsError());
      const user = this.users.find((usr) => usr.id === id);
      if (!user) reject(new NotFindError('User'));
      else resolve(user);
    });
  }
}
