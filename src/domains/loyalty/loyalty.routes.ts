import { Router } from 'express';
import { LoyaltyController } from './loyalty.controller';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';
import { adminMiddleware } from '../../shared/middlewares/adminMiddleware';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { loyaltyValidation } from '../../shared/validators/loyaltyValidation';

const router = Router();
const loyaltyController = new LoyaltyController();

// All loyalty routes require authentication
router.use(authMiddleware);

/**
 * @route GET /api/v1/loyalty/stats
 * @desc Get user's loyalty stats
 * @access Private
 */
router.get('/stats', loyaltyController.getLoyaltyStats.bind(loyaltyController));

/**
 * @route GET /api/v1/loyalty/history
 * @desc Get user's loyalty transaction history
 * @access Private
 */
router.get('/history', loyaltyController.getLoyaltyHistory.bind(loyaltyController));

/**
 * @route GET /api/v1/loyalty/expiring
 * @desc Get points expiring soon
 * @access Private
 */
router.get('/expiring', loyaltyController.getExpiringPoints.bind(loyaltyController));

/**
 * @route GET /api/v1/loyalty/earning-rules
 * @desc Get points earning rules
 * @access Private
 */
router.get('/earning-rules', loyaltyController.getEarningRules.bind(loyaltyController));

/**
 * @route GET /api/v1/loyalty/redemption-options
 * @desc Get points redemption options
 * @access Private
 */
router.get('/redemption-options', loyaltyController.getRedemptionOptions.bind(loyaltyController));

/**
 * @route POST /api/v1/loyalty/redeem
 * @desc Redeem loyalty points
 * @access Private
 */
router.post(
  '/redeem',
  validateRequest(loyaltyValidation.redeemPoints),
  loyaltyController.redeemPoints.bind(loyaltyController)
);

// Admin routes
/**
 * @route POST /api/v1/loyalty/admin/award
 * @desc Award points to a user (Admin only)
 * @access Private/Admin
 */
router.post(
  '/admin/award',
  adminMiddleware,
  validateRequest(loyaltyValidation.awardPoints),
  loyaltyController.awardPoints.bind(loyaltyController)
);

/**
 * @route GET /api/v1/loyalty/admin/analytics
 * @desc Get loyalty program analytics (Admin only)
 * @access Private/Admin
 */
router.get('/admin/analytics', adminMiddleware, loyaltyController.getLoyaltyAnalytics.bind(loyaltyController));

export default router;
