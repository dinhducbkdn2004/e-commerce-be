import { Router } from 'express';
import { UserController } from './user.controller';
import { validate } from '../../shared/middlewares/validate';
import { authenticate } from '../../shared/middlewares/authHandler';
import { updateUserSchema } from '../../shared/validators/user.validator';

const router = Router();
const userController = new UserController();

// Protected user profile routes
router.get('/profile', authenticate, 
  userController.getProfile.bind(userController));

router.put('/profile', authenticate, validate(updateUserSchema), 
  userController.updateProfile.bind(userController));

// Admin routes (would need admin middleware in real app)
router.get('/', authenticate, 
  userController.getAllUsers.bind(userController));

router.get('/:id', authenticate, 
  userController.getUserById.bind(userController));

router.put('/:id', authenticate, validate(updateUserSchema), 
  userController.updateUser.bind(userController));

router.delete('/:id', authenticate, 
  userController.deleteUser.bind(userController));

export default router; 