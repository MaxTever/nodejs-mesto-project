import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UNAUTHORIZED_ERROR } from '../helpers/errors';

interface SessionRequest extends Request {
    user?: string | JwtPayload;
}

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UNAUTHORIZED_ERROR('Необходима авторизация'));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
    req.user = payload; // записываем пейлоуд в объект запроса
    next(); // пропускаем запрос дальше
  } catch (err) {
    console.error('Token verification failed:', err);
    return next(new UNAUTHORIZED_ERROR('Неверный токен или срок действия токена истек'));
  }
};
