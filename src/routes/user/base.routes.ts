import { Router } from 'express';
import { BaseUserController } from '../../controllers/user/BaseUserController';
import { validate } from '../../middlewares/validate';
import { createUserSchema, updateUserSchema } from '../../validators/user.validator';

const router = Router();
const baseUserController = new BaseUserController();

// Basic user management
// POST /api/v1/users (create user)
router.post('/', validate(createUserSchema), baseUserController.create.bind(baseUserController));
// GET /api/v1/users (get all users)
router.get('/', baseUserController.getAll.bind(baseUserController));
// GET /api/v1/users/:id (get user by ID)
router.get('/:id', baseUserController.getById.bind(baseUserController));
// PUT /api/v1/users/:id (update user)
router.put('/:id', validate(updateUserSchema), baseUserController.update.bind(baseUserController));
// DELETE /api/v1/users/:id (delete user)
router.delete('/:id', baseUserController.delete.bind(baseUserController));

export default router;
