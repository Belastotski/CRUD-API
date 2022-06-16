import { v4, validate } from 'uuid';

export default class User {
  public readonly id: string;

  public username: string;

  public age: number;

  public hobbies: string[];

  static validId = (id: string): boolean => validate(id);

  constructor(user: User) {
    this.id = v4();
    this.username = user.username;
    this.age = user.age;
    this.hobbies = [...user.hobbies];
  }

  static isValid(user: User): boolean {
    return !!(user.age && user.username && user.hobbies && Array.isArray(user.hobbies));
  }

  public update = (user: User): User => {
    const { username, age, hobbies } = user;
    if (username) this.username = username;
    if (age) this.age = age;
    if (Array.isArray(hobbies)) this.hobbies = [...hobbies];
    return this;
  };
}
