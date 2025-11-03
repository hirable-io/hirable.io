import { UnauthorizedError } from '@/application/errors';
import { NextFunction, Request, Response } from 'express';
import { container } from '@/infra/container';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      file?: Express.Multer.File;
    }
  }
}

export async function authenticationMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const JWTService = container.get('JWTService');
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError();
  }

  const [type, token] = authHeader.split(' ');
  
  if (type != 'Bearer' || !token) {
    throw new UnauthorizedError();
  }

  try {
    const payload = await JWTService.verify({ token });
    req.user = payload;
    next();
  } catch {
    throw new UnauthorizedError();
  }
}