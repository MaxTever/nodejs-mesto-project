import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {
  STATUS_OK,
  STATUS_CREATED,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  CONFLICT_ERROR,
} from '../helpers/errors';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .orFail()
    .then((users) => { res.status(STATUS_OK).send({ data: users }); })
    .catch((err) => {
      next(err);
    });
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => { res.status(STATUS_CREATED).send(user); })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new CONFLICT_ERROR('Пользователь с таким email уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new BAD_REQUEST_ERROR('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      next(err);
    });
};

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const getCurrentUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  User.findById(req.user._id).select('-password')
    .then((user) => {
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NOT_FOUND_ERROR('Пользователь не найден'));
      }
      next(err);
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate('66ca23636985228f5d05facc', { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.status(STATUS_OK).send({ data: user });
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BAD_REQUEST_ERROR('Переданы некорректные данные при обновлении профиля'));
      } if (err.name === 'DocumentNotFoundError') {
        return next(new NOT_FOUND_ERROR('Пользователь не найден'));
      }
      next(err);
    });
};

export const updateUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate('66ca23636985228f5d05facc', { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BAD_REQUEST_ERROR('Переданы некорректные данные при обновлении профиля'));
      } if (err.name === 'DocumentNotFoundError') {
        return next(new NOT_FOUND_ERROR('Пользователь не найден'));
      }
      next(err);
    });
};
