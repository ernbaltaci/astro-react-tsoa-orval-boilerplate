export class AppError extends Error {
  constructor(
    public code: string,
    public message: string = 'An error occurred',
    public statusCode: number,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

