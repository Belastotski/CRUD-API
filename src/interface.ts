export interface CRUDSError {
  message: string;
  code: number;
}

export interface IUser {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
}
