import { Router } from 'express';
import { getUsers, getUserById, createUser, updateProfile, updateAvatar, login } from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);
router.post('/login', login);

export default router;