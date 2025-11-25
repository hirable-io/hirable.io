import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '@/application/errors';
import { Roles } from '@/domain';

export function authorizationMiddleware(allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !user.role) {
      throw new ForbiddenError();
    }

    if (user.role != Roles.ADMIN && !allowedRoles.includes(user.role)) {
      throw new ForbiddenError();
    }

    next();
  };
}
