import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface SessionRequest extends Request {
    user?: string | JwtPayload;
}

const handleAuthError = (res: Response) => {
  res
  .status(401)
  .send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header: string) => {
  return header.replace('Bearer ', '');
};

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  console.log('Authorization header:', authorization);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  console.log('Token:', token);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
    console.log('Payload:', payload);
  } catch (err) {
    console.error('Token verification failed:', err);
    return handleAuthError(res);
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  console.log('User:', req.user);
  next(); // пропускаем запрос дальше
};