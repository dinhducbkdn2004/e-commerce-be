import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../shared/middlewares/validate';
import { authenticate } from '../../shared/middlewares/authHandler';
import { 
  loginSchema,
  createUserSchema,
  emailVerificationSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
  googleAuthSchema,
  refreshTokenSchema,
  resendVerificationEmailSchema
} from '../../shared/validators/user.validator';

const router = Router();
const authController = new AuthController();

// Public authentication endpoints
router.post('/register', validate(createUserSchema), 
  authController.register.bind(authController));
  
router.post('/login', validate(loginSchema), 
  authController.login.bind(authController));

router.post('/google', validate(googleAuthSchema), 
  authController.googleAuth.bind(authController));

router.post('/refresh-token', validate(refreshTokenSchema), 
  authController.refreshToken.bind(authController));

// Email verification endpoints
router.post('/verify-email', validate(emailVerificationSchema), 
  authController.verifyEmail.bind(authController));

// Password reset endpoints
router.post('/forgot-password', validate(passwordResetRequestSchema), 
  authController.forgotPassword.bind(authController));

router.post('/reset-password', validate(passwordResetConfirmSchema), 
  authController.resetPassword.bind(authController));

router.post('/resend-verification-email', validate(resendVerificationEmailSchema), 
  authController.resendVerificationEmail.bind(authController));

// Protected endpoints
router.post('/logout', authenticate, 
  authController.logout.bind(authController));

export default router; 