import { Prisma } from '@prisma/client';
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
  let validationErrors: Record<string, string> = {};
  if (err instanceof Prisma.PrismaClientValidationError) {
    const missingFieldMatch = err.message.match(/Argument `(\w+)` is missing/);
    if (missingFieldMatch) {
      const missingField = missingFieldMatch[1];
      validationErrors[missingField] = `فیلد ${missingField} الزامی است`;
      errorDetails = `فیلد ${missingField} پر نشده است`;
    } else {
      errorDetails = 'داده‌های ارسالی نامعتبر هستند';
    }
  } else if (err?.meta) {
    errorDetails = err?.meta?.message || err?.message;
  } else {
    errorDetails = err?.message || 'با خطای غیرقابل پیش‌بینی مواجه شدیم!';
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
