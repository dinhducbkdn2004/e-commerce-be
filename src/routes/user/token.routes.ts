import express from 'express';
import { TokenController } from '../../controllers/user/TokenController';
import { authenticate } from '../../middlewares/authHandler';
import { validate } from '../../middlewares/validate';
import { refreshTokenSchema, revokeTokenSchema } from '../../validators/user.validator';

const router = express.Router();
const tokenController = new TokenController();

// Refresh access token
router.post('/refresh', 
  validate(refreshTokenSchema), 
  tokenController.refreshToken.bind(tokenController)
);

// Revoke specific refresh token (requires authentication)
router.post('/revoke', 
  authenticate,
  validate(revokeTokenSchema),
  tokenController.revokeToken.bind(tokenController)
);

// Revoke all refresh tokens (logout from all devices)
router.post('/revoke-all', 
  authenticate,
  tokenController.revokeAllTokens.bind(tokenController)
);

// Get active tokens for current user
router.get('/active', 
  authenticate,
  tokenController.getActiveTokens.bind(tokenController)
);

export default router;
