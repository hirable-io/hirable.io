import { ApiError } from '.';

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 'NotFoundError', 404, 'NOT_FOUND');
  }
}