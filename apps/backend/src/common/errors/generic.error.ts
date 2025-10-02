import { AppError } from './base.error';

export class NotFoundError extends AppError {
  constructor(message?: string) {
    super('NOT_FOUND', message || 'Not found', 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message?: string) {
    super('FORBIDDEN', message || 'Forbidden', 403);
  }
}

