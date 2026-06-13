import { Router } from 'express';
import { getCards, createCard, deleteCardById, likeCard, unlikeCard } from '../controllers/cards';
import { validateCreateCard, validateCardId } from '../middlewares/validators';

const router = Router();

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateCardId, deleteCardById);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, unlikeCard);

export default router;