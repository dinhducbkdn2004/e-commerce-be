import { Router } from 'express';
import { OrderController } from '../../controllers/user/OrderController';

const router = Router({ mergeParams: true });
const orderController = new OrderController();

// Order management
// POST /api/v1/users/:id/orders
router.post('/', orderController.addOrder.bind(orderController));

export default router;
