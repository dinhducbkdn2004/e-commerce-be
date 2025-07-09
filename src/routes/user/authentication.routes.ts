import { Router } from 'express';
import { AuthenticationController } from '../../controllers/user/AuthenticationController';
import { validate } from '../../middlewares/validate';
import { 
  loginSchema,
  createUserSchema,
  emailVerificationSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema 
} from '../../validators/user.validator';

const router = Router({ mergeParams: true });
const authenticationController = new AuthenticationController();

// Check if we're in a user-specific context (/:id/auth) or general auth (/auth)
const isUserContext = router.name === 'router';

// Authentication endpoints
router.post('/register', validate(createUserSchema), 
  authenticationController.register.bind(authenticationController));
  
router.post('/login', validate(loginSchema), 
  authenticationController.login.bind(authenticationController));

// Email verification endpoints
router.post('/verify-email', validate(emailVerificationSchema), 
  authenticationController.verifyEmail.bind(authenticationController));

router.post('/resend-verification', validate(passwordResetRequestSchema), 
  authenticationController.resendVerificationEmail.bind(authenticationController));

// Password reset endpoints
router.post('/forgot-password', validate(passwordResetRequestSchema), 
  authenticationController.requestPasswordReset.bind(authenticationController));

router.post('/reset-password', validate(passwordResetConfirmSchema), 
  authenticationController.resetPassword.bind(authenticationController));

export default router;
