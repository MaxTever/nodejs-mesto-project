import Router from 'express';
import {
  getUsers, getCurrentUser, getUserById, updateUser, updateUserAvatar,
} from '../controllers/users';
import auth from '../middlewares/auth';

const router = Router();

router.get('/', getUsers);
router.get('/me', auth, getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);


export default router;
