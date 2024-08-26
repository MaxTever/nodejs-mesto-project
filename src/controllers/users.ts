import { Request, Response } from 'express';
import User from '../models/user';
import {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_UNAUTHORIZED,
  STATUS_INTERNAL_SERVER_ERROR} from '../helpers/constants';
  import bcrypt from 'bcryptjs';
  import jwt from 'jsonwebtoken';

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => { res.status(STATUS_OK).send({ data: users }); })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError'){
        res.status(STATUS_NOT_FOUND).send({ message: 'Пользователи не найдены' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(STATUS_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};


export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
  .then(hash => User.create({
    name: name,
    about: about,
    avatar: avatar,
    email: email,
    password: hash
  }))
  .then((user) => {res.status(STATUS_CREATED).send(user)})
  .catch((err) => {
          console.error(err);
          if (err.name === 'ValidationError') {
            res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
          } else {
            res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
          }
        });

}


export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', {expiresIn: '7d'}),
      });
    })
    .catch((err) => {
      res.status(STATUS_UNAUTHORIZED).send({ message: err.message });
    });
};

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const getCurrentUser = (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  User.findById(req.user._id).select("-password")
  .then((user) => {
    res.status(STATUS_OK).send({ data: user });
    if (!user){
      res.status(STATUS_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
    }
  })
  .catch((err) => {
    console.error('Error finding user:', err);
    if (err.name === 'DocumentNotFoundError') {
     res.status(STATUS_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
   } else {
     res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
   }})
};


export const updateUser = (req: Request, res: Response) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate('66ca23636985228f5d05facc', { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(STATUS_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' })
      }
    });
};

export const updateUserAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate('66ca23636985228f5d05facc', { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(STATUS_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' })
      }
    });
};
