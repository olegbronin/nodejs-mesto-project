import { Router } from 'express';
import { getUsers, getUserById, updateProfile, updateAvatar, getCurrentUser } from '../controllers/users';
import { validateUserId, validateUpdateProfile, validateUpdateAvatar } from '../middlewares/validators';
const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUpdateProfile, updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

export default router;