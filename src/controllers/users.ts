import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => { res.send({ data: users }); })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const updateUser = (req: Request, res: Response) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate('66ca23636985228f5d05facc', { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => res.status(404).send({ message: 'Пользователь не найден' }));
};

export const updateUserAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate('66ca23636985228f5d05facc', { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => res.status(404).send({ message: 'Пользователь не найден' }));
};
