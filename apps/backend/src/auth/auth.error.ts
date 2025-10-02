import { AppError } from '../common/errors/base.error';

export class InvalidCredentialsError extends AppError {
  code = 'INVALID_CREDENTIALS';
  statusCode = 401;

  constructor(message?: string) {
    super('INVALID_CREDENTIALS', message, 401, true);
  }
}

export class TokenNotFoundError extends AppError {
  constructor(message: string) {
    super('TOKEN_NOT_FOUND', message, 401);
  }
}

export class UserNotFoundError extends AppError {
  constructor(message: string) {
    super('USER_NOT_FOUND', message, 401);
  }
}

export class InvalidTokenError extends AppError {
  constructor(message: string) {
    super('INVALID_TOKEN', message, 401);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super('UNAUTHORIZED', message, 401);
  }
}

export class EmailAlreadyRegisteredError extends AppError {
  constructor(message: string) {
    super('EMAIL_ALREADY_REGISTERED', message, 400);
  }
}

