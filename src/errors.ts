/* eslint-disable max-classes-per-file */
export class NotFindError extends Error {
  constructor(message = '') {
    super();
    this.message = `${message ? `${message} n` : 'N'}ot found`;
  }

  public code = 404;
}

export class ParametrsError extends Error {
  constructor(message = 'Invalid parametrs') {
    super();
    this.message = message;
  }

  public code = 400;
}
