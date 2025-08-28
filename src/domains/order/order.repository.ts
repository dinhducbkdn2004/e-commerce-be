import mongoose from 'mongoose';
import { Order, IOrder } from '../../models/Order';
import { UpdateOrderStatusDTO, OrderFilterDTO } from '../../dtos/order.dto';
import { logger } from '../../shared/utils/logger';

export class OrderRepository {

  async createOrder(orderData: any): Promise<IOrder> {
    try {
      const order = new Order(orderData);
      await order.save();
      return order;
    } catch (error) {
      logger.error('Error in createOrder:', error);
      throw new Error('Failed to create order');
    }
  }

  async getUserOrders(userId: string, filters: OrderFilterDTO): Promise<any> {
    try {
      const query: any = { userId: new mongoose.Types.ObjectId(userId) };
      
      // Apply filters
      if (filters.status) {
        query.orderStatus = filters.status;
      }
      if (filters.paymentStatus) {
        query.paymentStatus = filters.paymentStatus;
      }
      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
          query.createdAt.$gte = filters.startDate;
        }
        if (filters.endDate) {
          query.createdAt.$lte = filters.endDate;
        }
      }

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Order.countDocuments(query);
      const pages = Math.ceil(total / limit);

      return {
        orders: orders.map(order => ({
          _id: order._id,
          orderNumber: order.orderNumber,
          total: order.total,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
          estimatedDelivery: order.estimatedDelivery,
          itemCount: order.items.length
        })),
        pagination: {
          page,
          pages,
          total,
          hasNext: page < pages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      logger.error('Error in getUserOrders:', error);
      throw new Error('Failed to get user orders');
    }
  }

  async getAllOrders(filters: OrderFilterDTO): Promise<any> {
    try {
      const query: any = {};
      
      // Apply filters
      if (filters.status) {
        query.orderStatus = filters.status;
      }
      if (filters.paymentStatus) {
        query.paymentStatus = filters.paymentStatus;
      }
      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
          query.createdAt.$gte = filters.startDate;
        }
        if (filters.endDate) {
          query.createdAt.$lte = filters.endDate;
        }
      }

      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const skip = (page - 1) * limit;

      const orders = await Order.find(query)
        .populate('userId', 'name email phoneNumber')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Order.countDocuments(query);
      const pages = Math.ceil(total / limit);

      return {
        orders,
        pagination: {
          page,
          pages,
          total,
          hasNext: page < pages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      logger.error('Error in getAllOrders:', error);
      throw new Error('Failed to get all orders');
    }
  }

  async getOrderById(orderId: string, userId?: string): Promise<IOrder | null> {
    try {
      const query: any = { _id: orderId };
      if (userId) {
        query.userId = userId;
      }

      const order = await Order.findOne(query)
        .populate('userId', 'name email phoneNumber')
        .lean();

      return order;
    } catch (error) {
      logger.error('Error in getOrderById:', error);
      throw new Error('Failed to get order');
    }
  }

  async getOrderByNumber(orderNumber: string, userId?: string): Promise<IOrder | null> {
    try {
      const query: any = { orderNumber };
      if (userId) {
        query.userId = userId;
      }

      const order = await Order.findOne(query)
        .populate('userId', 'name email phoneNumber')
        .lean();

      return order;
    } catch (error) {
      logger.error('Error in getOrderByNumber:', error);
      throw new Error('Failed to get order by number');
    }
  }

  async updateOrderStatus(orderId: string, updateData: UpdateOrderStatusDTO): Promise<IOrder | null> {
    try {
      const updateFields: any = {};
      
      if (updateData.orderStatus) {
        updateFields.orderStatus = updateData.orderStatus;
        
        // Set specific timestamps based on status
        if (updateData.orderStatus === 'delivered') {
          updateFields.deliveredAt = new Date();
        } else if (updateData.orderStatus === 'cancelled') {
          updateFields.cancelledAt = new Date();
        }
      }
      
      if (updateData.paymentStatus) {
        updateFields.paymentStatus = updateData.paymentStatus;
        
        if (updateData.paymentStatus === 'refunded') {
          updateFields.refundedAt = new Date();
          if (updateData.refundAmount) {
            updateFields.refundAmount = updateData.refundAmount;
          }
        }
      }
      
      if (updateData.trackingNumber) {
        updateFields.trackingNumber = updateData.trackingNumber;
      }
      
      if (updateData.estimatedDelivery) {
        updateFields.estimatedDelivery = updateData.estimatedDelivery;
      }
      
      if (updateData.cancelReason) {
        updateFields.cancelReason = updateData.cancelReason;
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { $set: updateFields },
        { new: true }
      );

      return updatedOrder;
    } catch (error) {
      logger.error('Error in updateOrderStatus:', error);
      throw new Error('Failed to update order status');
    }
  }

  async cancelOrder(orderId: string, cancelReason?: string): Promise<boolean> {
    try {
      const updateFields: any = {
        orderStatus: 'cancelled',
        cancelledAt: new Date()
      };
      
      if (cancelReason) {
        updateFields.cancelReason = cancelReason;
      }

      const result = await Order.findByIdAndUpdate(
        orderId,
        { $set: updateFields },
        { new: true }
      );

      return !!result;
    } catch (error) {
      logger.error('Error in cancelOrder:', error);
      throw new Error('Failed to cancel order');
    }
  }

  async getOrderStatistics(userId: string): Promise<any> {
    try {
      const stats = await Order.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$total' },
            completedOrders: {
              $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
            },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] }
            },
            cancelledOrders: {
              $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] }
            }
          }
        }
      ]);

      const result = stats[0] || {
        totalOrders: 0,
        totalSpent: 0,
        completedOrders: 0,
        pendingOrders: 0,
        cancelledOrders: 0
      };

      // Get recent orders
      const recentOrders = await Order.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderNumber total orderStatus createdAt')
        .lean();

      return {
        ...result,
        recentOrders
      };
    } catch (error) {
      logger.error('Error in getOrderStatistics:', error);
      throw new Error('Failed to get order statistics');
    }
  }

  async getOrdersByStatus(status: string, limit?: number): Promise<IOrder[]> {
    try {
      const query = Order.find({ orderStatus: status })
        .sort({ createdAt: -1 });
      
      if (limit) {
        query.limit(limit);
      }

      return await query.lean();
    } catch (error) {
      logger.error('Error in getOrdersByStatus:', error);
      throw new Error('Failed to get orders by status');
    }
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<IOrder[]> {
    try {
      return await Order.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }).sort({ createdAt: -1 }).lean();
    } catch (error) {
      logger.error('Error in getOrdersByDateRange:', error);
      throw new Error('Failed to get orders by date range');
    }
  }
}
