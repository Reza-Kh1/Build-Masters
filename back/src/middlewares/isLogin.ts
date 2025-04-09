import { NextFunction, Request } from 'express';
import token from 'jsonwebtoken';
import { customError } from './globalError';
const isLogin = (req: Request, res: any, next: NextFunction) => {
  try {
    const cookieKey = process.env.COOKIE_KEY as string;
    const cookie = req.cookies[cookieKey];
    if (!cookie) throw new Error();
    token.verify(cookie, process.env.TOKEN_SECURITY as string);
    next();
  } catch (err) {
    throw customError('وارد حساب کاربری خود شوید.', 403);
  }
};
export default isLogin;
