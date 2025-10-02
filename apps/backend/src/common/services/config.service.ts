import { injectable } from 'tsyringe';
import { AppError } from '../errors/base.error';
import { logger } from '../utils/logger';
import { registerSingleton } from '../di.store';

@injectable()
export class ConfigService {
  constructor() {
    logger.info('🔧 ConfigService initialized successfully');
  }

  /**
   * Get environment variable value or throw error if not found
   * @param key Environment variable key
   * @param defaultValue Optional default value
   * @returns Environment variable value
   */
  getOrThrow(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue;

    if (value === undefined || value === null || value === '') {
      throw new AppError(
        'CONFIGURATION_ERROR',
        `Environment variable ${key} is required but not set`,
        500
      );
    }

    return value;
  }

  /**
   * Get environment variable value, return undefined if not found
   * @param key Environment variable key
   * @param defaultValue Optional default value
   * @returns Environment variable value or undefined
   */
  get(key: string, defaultValue?: string): string | undefined {
    return process.env[key] || defaultValue;
  }

  /**
   * Get environment variable as number or throw error if not found/invalid
   * @param key Environment variable key
   * @param defaultValue Optional default value
   * @returns Environment variable value as number
   */
  getNumberOrThrow(key: string, defaultValue?: number): number {
    const value = process.env[key];

    if (!value && defaultValue === undefined) {
      throw new AppError(
        'CONFIGURATION_ERROR',
        `Environment variable ${key} is required but not set`,
        500
      );
    }

    const numValue = value ? parseInt(value, 10) : defaultValue;

    if (numValue === undefined || isNaN(numValue)) {
      throw new AppError(
        'CONFIGURATION_ERROR',
        `Environment variable ${key} must be a valid number`,
        500
      );
    }

    return numValue;
  }

  /**
   * Get environment variable as boolean or throw error if not found/invalid
   * @param key Environment variable key
   * @param defaultValue Optional default value
   * @returns Environment variable value as boolean
   */
  getBooleanOrThrow(key: string, defaultValue?: boolean): boolean {
    const value = process.env[key];

    if (!value && defaultValue === undefined) {
      throw new AppError(
        'CONFIGURATION_ERROR',
        `Environment variable ${key} is required but not set`,
        500
      );
    }

    if (!value) return defaultValue!;

    const normalizedValue = value.toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalizedValue)) {
      return true;
    }
    if (['false', '0', 'no', 'off'].includes(normalizedValue)) {
      return false;
    }

    throw new AppError(
      'CONFIGURATION_ERROR',
      `Environment variable ${key} must be a valid boolean (true/false, 1/0, yes/no, on/off)`,
      500
    );
  }

  /**
   * Check if environment is development
   */
  isDevelopment(): boolean {
    return this.get('NODE_ENV') === 'development';
  }

  /**
   * Check if environment is production
   */
  isProduction(): boolean {
    return this.get('NODE_ENV') === 'production';
  }

  /**
   * Check if environment is test
   */
  isTest(): boolean {
    return this.get('NODE_ENV') === 'test';
  }
}

registerSingleton(ConfigService);

