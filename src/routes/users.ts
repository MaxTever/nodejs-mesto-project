import Router from 'express';
import {
  getUsers, createUser, getUserById, updateUser, updateUserAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);
export default router;
