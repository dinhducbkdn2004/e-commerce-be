import { Router } from 'express';
import { LoyaltyController } from '../../controllers/user/LoyaltyController';

const router = Router({ mergeParams: true });
const loyaltyController = new LoyaltyController();

// Loyalty management
// PUT /api/v1/users/:id/loyalty/points
router.put('/points', loyaltyController.updatePoints.bind(loyaltyController));

// POST /api/v1/users/:id/loyalty/vouchers
router.post('/vouchers', loyaltyController.addVoucher.bind(loyaltyController));

// DELETE /api/v1/users/:id/loyalty/vouchers/:voucherId
router.delete('/vouchers/:voucherId', loyaltyController.removeVoucher.bind(loyaltyController));

export default router;
