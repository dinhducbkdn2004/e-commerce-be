import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validate } from '../middlewares/validate';
import { createUserSchema } from '../validators/user.validator';

const router = Router();
const userController = new UserController();

// POST /api/v1/users (create user)
router.post('/', validate(createUserSchema), userController.create.bind(userController));
// GET /api/v1/users (get all users)
router.get('/', userController.getAll.bind(userController));
// GET /api/v1/users/:id (get user by ID)
router.get('/:id', userController.getById.bind(userController));
// PUT /api/v1/users/:id (update user)
router.put('/:id', validate(createUserSchema), userController.update.bind(userController));
// DELETE /api/v1/users/:id (delete user)
router.delete('/:id', userController.delete.bind(userController));
export default router;