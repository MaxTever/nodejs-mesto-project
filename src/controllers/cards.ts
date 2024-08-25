import { Request, Response } from 'express';
import Card from '../models/card';
import {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR} from '../helpers/constants';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .populate('owner')
    .then((cards) => { res.status(STATUS_OK).json(cards); })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError'){
        res.status(STATUS_NOT_FOUND).send({ message: 'Пользователи не найдены' });} else {
          res.status(STATUS_INTERNAL_SERVER_ERROR).json({ message: 'На сервере произошла ошибка' });
        }
    });
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = '66ca23636985228f5d05facc';
  Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_CREATED).json(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).json({ message: 'Переданы некорректные данные' });
      }
      return res.status(STATUS_INTERNAL_SERVER_ERROR).json({ message: 'На сервере произошла ошибка' });
    });
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    if (!card) {
      return res.status(STATUS_NOT_FOUND).json({ message: 'Карточка не найдена' });
    }

    return res.status(STATUS_OK).json({ message: 'Карточка удалена' });
  } catch (err: any) {
    if (err.kind === 'CastError') {
      return res.status(STATUS_BAD_REQUEST).json({ message: 'Некорректный _id карточки' });
    }
    return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  const owner = '66ca23636985228f5d05facc';
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: owner } },
      { new: true },
    );
    if (!card) {
      return res.status(STATUS_NOT_FOUND).json({ message: 'Передан несуществующий _id карточки' });
    }

    return res.status(STATUS_OK).json(card);
  } catch (err:any) {
    if (err.kind === 'ObjectId') {
      return res.status(STATUS_BAD_REQUEST).json({ message: 'Некорректный _id карточки' });
    }

    return res.status(STATUS_INTERNAL_SERVER_ERROR).json({ message: 'На сервере произошла ошибка' });
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  const owner = '66ca23636985228f5d05facc';
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: owner } },
      { new: true },
    );
    if (!card) {
      return res.status(STATUS_NOT_FOUND).json({ message: 'Передан несуществующий _id карточки' });
    }
    return res.status(STATUS_OK).json(card);
  } catch (err: any) {
    if (err.kind === 'ObjectId') {
      return res.status(STATUS_BAD_REQUEST).json({ message: 'Некорректный _id карточки' });
    }
    return res.status(STATUS_INTERNAL_SERVER_ERROR).json({ message: 'На сервере произошла ошибка' });
  }
};
