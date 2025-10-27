import { ApiError } from '.';

export class UnauthorizedError extends ApiError {
  constructor() {
    super('Unauthorized user', 'UnauthorizedError', 401, 'UNAUTHORIZED');
  }
}