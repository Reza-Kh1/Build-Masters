import { NextFunction, Response, Request } from 'express';

const globalHandler = (
  err: {
    stack?: string;
    message?: string;
    statusCode?: number;
    details?: string;
  },
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const stack = err?.stack;
  const detail = err?.details;
  const message = err?.message;
  const statusCode = err?.statusCode ? err?.statusCode : 500;
  res.status(statusCode).json({
    detail,
    stack,
    message,
  });
};

const customError = (
  message: string,
  statusCode: number,
  err?: any
): Error & { statusCode?: number; details?: string } => {
  let errorDetails: string;
  if (err?.meta) {
    errorDetails = err?.meta?.message;
  } else {
    errorDetails = 'با خطا غیر قابل پیش بینی مواجه شدیم!';
  }
  const error = new Error(message) as Error & {
    statusCode?: number;
    details?: string;
  };
  error.statusCode = statusCode;
  error.details = errorDetails;
  return error;
};

const notFound = (req: Request, res: Response) => {
  res.status(404).send(`Route ${req.originalUrl} Not Found`);
};

export { globalHandler, customError, notFound };
