import { Router } from 'express';
import { getCards, createCard, deleteCardById, likeCard, unlikeCard } from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', unlikeCard);

export default router;