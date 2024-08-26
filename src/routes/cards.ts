import Router from 'express';
import { celebrate } from 'celebrate';
import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';
import { cardIdValidation, createCardValidation } from '../middlewares/validation';

const router = Router();

router.get('/', getCards);
router.post('/', celebrate(createCardValidation), createCard);
router.put('/:cardId/likes', celebrate(cardIdValidation), likeCard);
router.delete('/:cardId/likes', celebrate(cardIdValidation), dislikeCard);
router.delete('/:cardId', celebrate(cardIdValidation), deleteCard);

export default router;
