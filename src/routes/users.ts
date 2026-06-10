import { Router } from 'express';
import { getUsers, getUserById, createUser, updateProfile, updateAvatar, login, getCurrentUser } from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.get('/me', getCurrentUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

export default router;