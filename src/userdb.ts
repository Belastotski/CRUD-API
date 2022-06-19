import User from './entity/user';

export default class UsersDB {
  static users: Map<string, User> = new Map();
  static clear() {
    UsersDB.users = new Map();
  }
}
