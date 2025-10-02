import { UserRole } from '@prisma/client';

export interface AccessTokenPayload {
  id: string;
  role: UserRole;
  type: string;
}

declare module 'tsoa' {
  interface Request {
    payload: AccessTokenPayload;
  }
  interface Response {
    tokenPayload?: AccessTokenPayload;
  }
}

declare module 'express' {
  interface Request {
    payload?: AccessTokenPayload;
  }
  interface Response {
    payload?: AccessTokenPayload;
  }
}

export type AssignedToAdminDetails = {
  id: string;
  name: string;
  serviceId?: string | null;
  serviceName?: string | null;
};

