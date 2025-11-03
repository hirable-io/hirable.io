import { ApiError } from '.';

export class ForbiddenError extends ApiError {
  constructor() {
    super('Forbidden', 'ForbiddenError', 403, 'FORBIDDEN');
  }
}