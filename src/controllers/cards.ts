import { Request, Response } from 'express';
import Card from '../models/card';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .populate('owner')
    .then((cards) => { res.status(200).json(cards); })
    .catch(() => {
      res.status(500).json({ message: 'Ошибка сервера' });
    });
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = '66ca23636985228f5d05facc';
  Card.create({ name, link, owner })
    .then((card) => res.status(201).json(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).json({ message: 'Ошибка сервера' });
    });
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    if (!card) {
      return res.status(404).json({ message: 'Карточка не найдена' });
    }

    return res.status(200).json({ message: 'Карточка удалена' });
  } catch (err: any) {
    if (err.kind === 'CastError') {
      return res.status(400).json({ message: 'Некорректный _id карточки' });
    }
    return res.status(500).send({ message: 'Ошибка сервера' });
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
      return res.status(404).json({ message: 'Карточка не найдена' });
    }

    return res.status(200).json(card);
  } catch (err:any) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Некорректный _id карточки' });
    }

    return res.status(500).json({ message: 'Ошибка сервера' });
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
      return res.status(404).json({ message: 'Карточка не найдена' });
    }
    return res.status(200).json(card);
  } catch (err: any) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Некорректный _id карточки' });
    }
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};
