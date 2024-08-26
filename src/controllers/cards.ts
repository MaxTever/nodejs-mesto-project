import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import {
  STATUS_OK,
  STATUS_CREATED,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  FORBIDDEN_ERROR,
} from '../helpers/errors';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .populate('owner')
    .then((cards) => { res.status(STATUS_OK).json(cards); })
    .catch((err) => {
      next(err);
    });
};

interface AuthRequest extends Request {
  user?: { _id: string };
}

export const createCard = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user?._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_CREATED).json(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BAD_REQUEST_ERROR('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};

export const deleteCard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      return next(new NOT_FOUND_ERROR('Карточка не найдена'));
    }

    if (card.owner.toString() !== req.user?._id) {
      return next(new FORBIDDEN_ERROR('Недостаточно прав для удаления карточки'));
    }
    await Card.findByIdAndDelete(req.params.cardId);
    return res.status(STATUS_OK).json({ message: 'Карточка удалена' });
  } catch (err: any) {
    if (err.kind === 'CastError') {
      return next(new BAD_REQUEST_ERROR('Некорректный _id карточки'));
    }
    next(err);
  }
};

export const likeCard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const owner = req.user?._id;
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: owner } },
      { new: true },
    );
    if (!card) {
      return next(new NOT_FOUND_ERROR('Карточка не найдена'));
    }

    return res.status(STATUS_OK).json(card);
  } catch (err:any) {
    if (err.kind === 'ObjectId') {
      return next(new BAD_REQUEST_ERROR('Некорректный _id карточки'));
    }
    next(err);
  }
};

export const dislikeCard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const owner = req.user?._id;
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: owner } },
      { new: true },
    );
    if (!card) {
      return next(new NOT_FOUND_ERROR('Карточка не найдена'));
    }
    return res.status(STATUS_OK).json(card);
  } catch (err: any) {
    if (err.kind === 'ObjectId') {
      return next(new BAD_REQUEST_ERROR('Некорректный _id карточки'));
    }
    next(err);
  }
};
