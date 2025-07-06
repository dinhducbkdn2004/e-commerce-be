import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validate } from '../middlewares/validate';
import { createUserSchema } from '../validators/user.validator';

const router = Router();
const userController = new UserController();

// POST /api/v1/users (create user)
router.post('/', validate(createUserSchema), userController.create.bind(userController));

export default router;