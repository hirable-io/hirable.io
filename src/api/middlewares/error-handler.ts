import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/application/errors';
import { MulterError } from 'multer';
import { parseMulterError } from '@/helpers';

export function errorHandler(
  err: ApiError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      error: err.name,
      fields: err.extraFields?.fields,
      message: err.message,
      code: err.code,
    });
  } else if (err instanceof MulterError) {
    const { status, message } = parseMulterError(err.code);
    res.status(status).json({
      error: 'ValidationError',
      message,
    });
  } else {
    res.status(500).json({
      message: err.message ?? 'Internal Server Error',
    });
  }
}