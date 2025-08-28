import { IAddress } from '../models/Address';

export interface OrderItemDTO {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  images: string[];
}

export interface CreateOrderDTO {
  items: OrderItemDTO[];
  shippingAddress: IAddress;
  billingAddress?: IAddress;
  paymentMethod: 'cod' | 'card' | 'bank_transfer' | 'momo' | 'zalopay';
  notes?: string;
  useDefaultAddress?: boolean;
}

export interface UpdateOrderStatusDTO {
  orderStatus?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  estimatedDelivery?: Date;
  cancelReason?: string;
  refundAmount?: number;
}

export interface OrderFilterDTO {
  status?: string;
  paymentStatus?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface OrderSummaryDTO {
  orderNumber: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: Date;
  estimatedDelivery?: Date;
  itemCount: number;
}

export interface OrderDetailDTO {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItemDTO[];
  shippingAddress: IAddress;
  billingAddress?: IAddress;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  refundAmount?: number;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
