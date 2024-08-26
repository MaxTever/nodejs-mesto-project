import Router from 'express';
import { celebrate } from 'celebrate';
import {
  getUsers, getCurrentUser, getUserById, updateUser, updateUserAvatar,
} from '../controllers/users';
import auth from '../middlewares/auth';
import { userIdValidation, updateAvatarValidation, updateUserValidation } from '../middlewares/validation';

const router = Router();

router.get('/', getUsers);
router.get('/me', auth, getCurrentUser);
router.get('/:userId', celebrate(userIdValidation), getUserById);
router.patch('/me', celebrate(updateUserValidation), updateUser);
router.patch('/me/avatar', celebrate(updateAvatarValidation), updateUserAvatar);

export default router;
