import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../validators/user.validator';

const router = Router();
const authController = new AuthController();

// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), authController.login.bind(authController));

export default router;
