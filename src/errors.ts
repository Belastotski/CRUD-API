/* eslint-disable max-classes-per-file */

import { CRUDSError } from './interface';

export class NotFindError extends Error implements CRUDSError {
  constructor(message = '') {
    super();
    this.message = `${message ? `${message} n` : 'N'}ot found`;
  }

  public code = 404;
}

export class ParametrsError extends Error {
  constructor(public message = 'Invalid parametrs') {
    super();
  }
  public code = 400;
}
