import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../../users/user.service';
import { InvalidTokenError, TokenNotFoundError } from '../../auth/auth.error';
import { logger } from '../utils/logger';
import { AccessTokenPayload } from '../../types';
import { container } from 'tsyringe';
// Using plain object typing for user to keep boilerplate generic

export const expressAuthentication = async (
  request: Request,
  securityName: string
) => {
  if (securityName !== 'jwt') throw new Error('Invalid security name');

  const token = request.headers.authorization?.split(' ')[1];
  if (!token) throw new TokenNotFoundError('No token provided');

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AccessTokenPayload;
    if (decoded.type !== 'access')
      throw new InvalidTokenError('Invalid token type');

    const { id } = decoded;
    let user: { id: string; isDeleted: boolean } | null;
    user = (await container.resolve(UserService).getByIdOrNull?.(id)) ?? null;
    if (user === null) {
      // Fallback: use UserService.getById which returns null if deleted/missing
      try {
        const svc = container.resolve(UserService) as any;
        if (typeof svc.getById === 'function') {
          const u = await svc.getById(id);
          user = u as any;
        }
      } catch {}
    }

    if (!user) throw new InvalidTokenError('Account inactive or not found');

    if (user.isDeleted)
      throw new InvalidTokenError('Account inactive or not found');

    // For a generic boilerplate, skip role-based scope checks

    (request as any).payload = decoded;
  } catch (err) {
    logger.error('Auth error:', err);
    throw err instanceof InvalidTokenError
      ? err
      : new InvalidTokenError('Authentication failed');
  }
};

