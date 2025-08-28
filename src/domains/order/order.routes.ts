import { Router } from 'express';
import { OrderController } from './order.controller';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';
import { adminMiddleware } from '../../shared/middlewares/adminMiddleware';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { orderValidation } from '../../shared/validators/orderValidation';

const router = Router();
const orderController = new OrderController();

// All order routes require authentication
router.use(authMiddleware);

/**
 * @route POST /api/v1/orders
 * @desc Create new order
 * @access Private
 */
router.post(
  '/',
  validateRequest(orderValidation.createOrder),
  orderController.createOrder.bind(orderController)
);

/**
 * @route POST /api/v1/orders/from-cart
 * @desc Create order from cart
 * @access Private
 */
router.post(
  '/from-cart',
  validateRequest(orderValidation.createOrderFromCart),
  orderController.createOrderFromCart.bind(orderController)
);

/**
 * @route GET /api/v1/orders
 * @desc Get user's orders (with pagination and filters)
 * @access Private
 */
router.get('/', orderController.getUserOrders.bind(orderController));

/**
 * @route GET /api/v1/orders/statistics
 * @desc Get user's order statistics
 * @access Private
 */
router.get('/statistics', orderController.getOrderStatistics.bind(orderController));

/**
 * @route GET /api/v1/orders/:orderId
 * @desc Get order by ID
 * @access Private
 */
router.get('/:orderId', orderController.getOrderById.bind(orderController));

/**
 * @route GET /api/v1/orders/number/:orderNumber
 * @desc Get order by order number
 * @access Private
 */
router.get('/number/:orderNumber', orderController.getOrderByNumber.bind(orderController));

/**
 * @route PUT /api/v1/orders/:orderId/cancel
 * @desc Cancel order
 * @access Private
 */
router.put(
  '/:orderId/cancel',
  validateRequest(orderValidation.cancelOrder),
  orderController.cancelOrder.bind(orderController)
);

// Admin routes
/**
 * @route GET /api/v1/orders/admin/all
 * @desc Get all orders (Admin only)
 * @access Private/Admin
 */
router.get('/admin/all', adminMiddleware, orderController.getAllOrders.bind(orderController));

/**
 * @route PUT /api/v1/orders/admin/:orderId/status
 * @desc Update order status (Admin only)
 * @access Private/Admin
 */
router.put(
  '/admin/:orderId/status',
  adminMiddleware,
  validateRequest(orderValidation.updateOrderStatus),
  orderController.updateOrderStatus.bind(orderController)
);

export default router;
