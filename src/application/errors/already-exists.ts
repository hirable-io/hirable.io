import { ApiError } from '.';

export class AlreadyExistsError extends ApiError {
  constructor(message: string) {
    super(message, 'AlreadyExistsError', 409, 'ALREADY_EXISTS');
  }
}
