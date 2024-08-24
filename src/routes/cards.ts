import Router from 'express';
import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);
router.delete('/:cardId', deleteCard);

export default router;
