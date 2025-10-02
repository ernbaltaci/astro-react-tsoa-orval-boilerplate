import { inject, injectable } from 'tsyringe';
import { ConfigService } from '../common/services/config.service';
import { DatabaseService } from '../database/database.service';
import { AccessTokenPayload } from '../types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
} from './auth.error';
import { User } from '@prisma/client';
import { registerService } from '../common/di.store';
import { LoginDto, RegisterDto } from './auth.dto';

@injectable()
export class AuthService {
  constructor(
    @inject(ConfigService) private cfg: ConfigService,
    @inject(DatabaseService) private db: DatabaseService
  ) {}

  private sign(user: Pick<User, 'id' | 'role'>) {
    const payload: AccessTokenPayload = {
      id: user.id,
      role: user.role,
      type: 'access',
    };
    return jwt.sign(payload, this.cfg.getOrThrow('JWT_SECRET'), {
      expiresIn: '7d',
    });
  }

  async login({ email, password }: LoginDto) {
    const user = await this.db.prisma.user.findUnique({
      where: { email },
    });

    if (
      !user ||
      user.isDeleted ||
      !(await bcrypt.compare(password, user.password))
    ) {
      throw new InvalidCredentialsError();
    }

    return { token: this.sign(user), user };
  }

  async register({ email, password }: RegisterDto) {
    const existing = await this.db.prisma.user.findUnique({ where: { email } });
    if (existing && !existing.isDeleted) {
      throw new EmailAlreadyRegisteredError('Email is already registered');
    }

    const hashed = await bcrypt.hash(password, 10);
    const created = await this.db.prisma.user.create({
      data: { email, password: hashed },
    });

    return { token: this.sign(created), user: created };
  }
}

registerService(AuthService);

