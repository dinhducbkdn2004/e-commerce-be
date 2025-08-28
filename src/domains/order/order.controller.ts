import { Request, Response } from 'express';
import { OrderService } from './order.service';
import { CreateOrderDTO, UpdateOrderStatusDTO, OrderFilterDTO } from '../../dtos/order.dto';
import { ResponseHelper } from '../../shared/utils/ResponseHelper';
import { logger } from '../../shared/utils/logger';
import { AuthenticatedRequest } from '../../shared/types/express';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  // Create new order
  async createOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const orderData: CreateOrderDTO = req.body;
      const order = await this.orderService.createOrder(userId, orderData);
      
      ResponseHelper.created(res, order, 'Order created successfully', 'Tạo đơn hàng thành công');
    } catch (error: any) {
      logger.error('Error creating order:', error);
      ResponseHelper.error(res, error.message, 'Không thể tạo đơn hàng');
    }
  }

  // Get user's orders
  async getUserOrders(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const filters: OrderFilterDTO = {
        status: req.query.status as string,
        paymentStatus: req.query.paymentStatus as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10
      };

      const result = await this.orderService.getUserOrders(userId, filters);
      ResponseHelper.success(res, result, 'Orders retrieved successfully', 'Lấy danh sách đơn hàng thành công');
    } catch (error: any) {
      logger.error('Error getting user orders:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy danh sách đơn hàng');
    }
  }

  // Get order by ID
  async getOrderById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { orderId } = req.params;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const order = await this.orderService.getOrderById(orderId, userId);
      if (!order) {
        ResponseHelper.notFound(res, 'Order not found', 'Không tìm thấy đơn hàng');
        return;
      }

      ResponseHelper.success(res, order, 'Order retrieved successfully', 'Lấy chi tiết đơn hàng thành công');
    } catch (error: any) {
      logger.error('Error getting order by ID:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy chi tiết đơn hàng');
    }
  }

  // Get order by order number
  async getOrderByNumber(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { orderNumber } = req.params;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const order = await this.orderService.getOrderByNumber(orderNumber, userId);
      if (!order) {
        ResponseHelper.notFound(res, 'Order not found', 'Không tìm thấy đơn hàng');
        return;
      }

      ResponseHelper.success(res, order, 'Order retrieved successfully', 'Lấy chi tiết đơn hàng thành công');
    } catch (error: any) {
      logger.error('Error getting order by number:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy chi tiết đơn hàng');
    }
  }

  // Cancel order
  async cancelOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { orderId } = req.params;
      const { cancelReason } = req.body;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const success = await this.orderService.cancelOrder(orderId, userId, cancelReason);
      if (!success) {
        ResponseHelper.badRequest(res, 'Cannot cancel this order', 'Không thể hủy đơn hàng này');
        return;
      }

      ResponseHelper.success(res, null, 'Order cancelled successfully', 'Hủy đơn hàng thành công');
    } catch (error: any) {
      logger.error('Error cancelling order:', error);
      ResponseHelper.error(res, error.message, 'Không thể hủy đơn hàng');
    }
  }

  // Admin: Get all orders
  async getAllOrders(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const filters: OrderFilterDTO = {
        status: req.query.status as string,
        paymentStatus: req.query.paymentStatus as string,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20
      };

      const result = await this.orderService.getAllOrders(filters);
      ResponseHelper.success(res, result, 'Orders retrieved successfully', 'Lấy danh sách đơn hàng thành công');
    } catch (error: any) {
      logger.error('Error getting all orders:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy danh sách đơn hàng');
    }
  }

  // Admin: Update order status
  async updateOrderStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const updateData: UpdateOrderStatusDTO = req.body;

      const updatedOrder = await this.orderService.updateOrderStatus(orderId, updateData);
      if (!updatedOrder) {
        ResponseHelper.notFound(res, 'Order not found', 'Không tìm thấy đơn hàng');
        return;
      }

      ResponseHelper.success(res, updatedOrder, 'Order status updated successfully', 'Cập nhật trạng thái đơn hàng thành công');
    } catch (error: any) {
      logger.error('Error updating order status:', error);
      ResponseHelper.error(res, error.message, 'Không thể cập nhật trạng thái đơn hàng');
    }
  }

  // Get order statistics
  async getOrderStatistics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const stats = await this.orderService.getOrderStatistics(userId);
      ResponseHelper.success(res, stats, 'Order statistics retrieved successfully', 'Lấy thống kê đơn hàng thành công');
    } catch (error: any) {
      logger.error('Error getting order statistics:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy thống kê đơn hàng');
    }
  }

  // Create order from cart
  async createOrderFromCart(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const { shippingAddress, billingAddress, paymentMethod, notes, useDefaultAddress } = req.body;
      
      const order = await this.orderService.createOrderFromCart(userId, {
        shippingAddress,
        billingAddress,
        paymentMethod,
        notes,
        useDefaultAddress
      });
      
      ResponseHelper.created(res, order, 'Order created from cart successfully', 'Tạo đơn hàng từ giỏ hàng thành công');
    } catch (error: any) {
      logger.error('Error creating order from cart:', error);
      ResponseHelper.error(res, error.message, 'Không thể tạo đơn hàng từ giỏ hàng');
    }
  }
}
