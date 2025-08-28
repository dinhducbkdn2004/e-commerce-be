import { OrderRepository } from './order.repository';
import { CreateOrderDTO, UpdateOrderStatusDTO, OrderFilterDTO } from '../../dtos/order.dto';
import { IOrder } from '../../models/Order';
import { CartService } from '../cart/cart.service';
import { AddressService } from '../address/address.service';
import { logger } from '../../shared/utils/logger';

export class OrderService {
  private orderRepository: OrderRepository;
  private cartService: CartService;
  private addressService: AddressService;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.cartService = new CartService();
    this.addressService = new AddressService();
  }

  async createOrder(userId: string, orderData: CreateOrderDTO): Promise<IOrder> {
    try {
      // Validate order items
      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      // Calculate totals
      const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shippingFee = this.calculateShippingFee(subtotal);
      const tax = this.calculateTax(subtotal);
      const total = subtotal + shippingFee + tax;

      const order = await this.orderRepository.createOrder({
        userId,
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress,
        paymentMethod: orderData.paymentMethod,
        notes: orderData.notes,
        subtotal,
        shippingFee,
        tax,
        total,
        currency: 'VND'
      });

      logger.info(`Order created: ${order.orderNumber} for user: ${userId}`);
      return order;
    } catch (error) {
      logger.error('Error in createOrder:', error);
      throw error;
    }
  }

  async createOrderFromCart(userId: string, orderData: Omit<CreateOrderDTO, 'items'>): Promise<IOrder> {
    try {
      // Get cart items
      const cart = await this.cartService.getCartByUserId(userId);
      if (!cart.items || cart.items.length === 0) {
        throw new Error('Cart is empty');
      }

      // Get shipping address
      let shippingAddress = orderData.shippingAddress;
      if (orderData.useDefaultAddress) {
        const defaultAddress = await this.addressService.getDefaultAddress(userId);
        if (!defaultAddress) {
          throw new Error('No default address found');
        }
        shippingAddress = defaultAddress;
      }

      // Convert cart items to order items
      const orderItems = cart.items.map(item => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        images: item.product.images
      }));

      // Create order
      const order = await this.createOrder(userId, {
        items: orderItems,
        shippingAddress,
        billingAddress: orderData.billingAddress,
        paymentMethod: orderData.paymentMethod,
        notes: orderData.notes
      });

      // Clear cart after successful order creation
      await this.cartService.clearCart(userId);

      return order;
    } catch (error) {
      logger.error('Error in createOrderFromCart:', error);
      throw error;
    }
  }

  async getUserOrders(userId: string, filters: OrderFilterDTO): Promise<any> {
    try {
      return await this.orderRepository.getUserOrders(userId, filters);
    } catch (error) {
      logger.error('Error in getUserOrders:', error);
      throw error;
    }
  }

  async getAllOrders(filters: OrderFilterDTO): Promise<any> {
    try {
      return await this.orderRepository.getAllOrders(filters);
    } catch (error) {
      logger.error('Error in getAllOrders:', error);
      throw error;
    }
  }

  async getOrderById(orderId: string, userId?: string): Promise<IOrder | null> {
    try {
      return await this.orderRepository.getOrderById(orderId, userId);
    } catch (error) {
      logger.error('Error in getOrderById:', error);
      throw error;
    }
  }

  async getOrderByNumber(orderNumber: string, userId?: string): Promise<IOrder | null> {
    try {
      return await this.orderRepository.getOrderByNumber(orderNumber, userId);
    } catch (error) {
      logger.error('Error in getOrderByNumber:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, updateData: UpdateOrderStatusDTO): Promise<IOrder | null> {
    try {
      const order = await this.orderRepository.updateOrderStatus(orderId, updateData);
      
      if (order) {
        logger.info(`Order status updated: ${order.orderNumber} - ${updateData.orderStatus || 'payment updated'}`);
      }
      
      return order;
    } catch (error) {
      logger.error('Error in updateOrderStatus:', error);
      throw error;
    }
  }

  async cancelOrder(orderId: string, userId: string, cancelReason?: string): Promise<boolean> {
    try {
      const order = await this.orderRepository.getOrderById(orderId, userId);
      
      if (!order) {
        throw new Error('Order not found');
      }

      // Only allow cancellation for certain statuses
      const cancellableStatuses = ['pending', 'confirmed'];
      if (!cancellableStatuses.includes(order.orderStatus)) {
        throw new Error('Order cannot be cancelled at this stage');
      }

      const success = await this.orderRepository.cancelOrder(orderId, cancelReason);
      
      if (success) {
        logger.info(`Order cancelled: ${order.orderNumber} by user: ${userId}`);
      }
      
      return success;
    } catch (error) {
      logger.error('Error in cancelOrder:', error);
      throw error;
    }
  }

  async getOrderStatistics(userId: string): Promise<any> {
    try {
      return await this.orderRepository.getOrderStatistics(userId);
    } catch (error) {
      logger.error('Error in getOrderStatistics:', error);
      throw error;
    }
  }

  // Helper methods
  private calculateShippingFee(subtotal: number): number {
    // Free shipping for orders over 500,000 VND
    if (subtotal >= 500000) {
      return 0;
    }
    // Standard shipping fee
    return 30000;
  }

  private calculateTax(subtotal: number): number {
    // VAT 10% (Vietnam standard)
    return Math.round(subtotal * 0.1);
  }

  async validateOrderItems(items: any[]): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    for (const item of items) {
      if (!item.productId) {
        errors.push('Product ID is required for all items');
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push('Valid quantity is required for all items');
      }
      if (!item.price || item.price <= 0) {
        errors.push('Valid price is required for all items');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
