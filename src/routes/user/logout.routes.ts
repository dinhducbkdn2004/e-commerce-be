import express from 'express';
import { LogoutController } from '../../controllers/user/LogoutController';
import { authenticate } from '../../middlewares/authHandler';
import { csrfProtection, getCSRFToken } from '../../middlewares/csrfProtection';
import { validate } from '../../middlewares/validate';
import { refreshTokenSchema } from '../../validators/user.validator';

const router = express.Router();
const logoutController = new LogoutController();

// Get CSRF token for logout operations
router.get('/csrf-token', getCSRFToken);

// Logout from current device
router.post('/logout', 
  authenticate, 
  csrfProtection,
  logoutController.logout.bind(logoutController)
);

// Logout from all devices
router.post('/logout-all', 
  authenticate, 
  csrfProtection,
  logoutController.logoutAll.bind(logoutController)
);

// Logout specific device
router.post('/logout-device', 
  authenticate, 
  csrfProtection,
  validate(refreshTokenSchema),
  logoutController.logoutDevice.bind(logoutController)
);

// Check logout status
router.get('/status', 
  authenticate, 
  logoutController.checkLogoutStatus.bind(logoutController)
);

export default router;
