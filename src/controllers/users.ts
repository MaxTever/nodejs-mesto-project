import { Request, Response } from 'express';
import User from '../models/user';
import {
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR} from '../helpers/constants';

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
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

export const updateUser = (req: Request, res: Response) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate('66ca23636985228f5d05facc', { name, about }, { new: true, runValidators: true })
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
