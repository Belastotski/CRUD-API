import http from 'http';
import { validate } from 'uuid';
import { ParametrsError } from './errors.js';
import User from './interface.js';

export default class CRUDS {
  static getData(request: http.IncomingMessage): Promise<User> {
    return new Promise((resolve, reject) => {
      try {
        let content = '';
        request.on('data', (chunk: string) => {
          content += chunk.toString();
        });
        request.on('end', () => {
          // const json = JSON.stringify(content);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const user: User = JSON.parse(content);
          resolve(user);
        });
      } catch (error) {
        reject(new ParametrsError('Not contain required fields'));
      }
    });
  }

  static getId(request: http.IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
      let url: string | string[] | undefined = request.url || '';
      if (!url) reject(new ParametrsError());
      else url = url.split('/');
      if (url.length < 4) reject(new ParametrsError());
      if (validate(url[3])) resolve(url[3]);
      else reject(new ParametrsError());
    });
  }

  static getCode(code: unknown): number {
    return parseInt(String(code), 10) || 500;
  }
}
