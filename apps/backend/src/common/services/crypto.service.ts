import { injectable, inject } from 'tsyringe';
import * as crypto from 'crypto';
import { logger } from '../utils/logger';
import { AppError } from '../errors/base.error';
import { ConfigService } from './config.service';
import { registerSingleton } from '../di.store';

@injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-ctr';
  private readonly secretKey: Buffer;

  constructor(@inject(ConfigService) private configService: ConfigService) {
    const key = this.configService.getOrThrow('DATA_ENCRYPTION_KEY');
    this.secretKey = crypto.createHash('sha256').update(key).digest();
    logger.info('🔐 CryptoService initialized successfully');
  }

  encrypt(text: string): string {
    try {
      if (!text) return text;
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
      const encrypted = Buffer.concat([
        cipher.update(text, 'utf8'),
        cipher.final(),
      ]);
      return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    } catch (error) {
      logger.error('Error encrypting data:', error);
      throw new AppError('ENCRYPTION_ERROR', 'Failed to encrypt data', 500);
    }
  }

  decrypt(hash: string): string {
    try {
      if (!hash || !hash.includes(':')) return hash;
      const [ivHex, encryptedHex] = hash.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const encrypted = Buffer.from(encryptedHex, 'hex');
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.secretKey,
        iv
      );
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);
      return decrypted.toString('utf8');
    } catch (error) {
      logger.error('Error decrypting data:', error);
      throw new AppError('DECRYPTION_ERROR', 'Failed to decrypt data', 500);
    }
  }
}

registerSingleton(CryptoService);

