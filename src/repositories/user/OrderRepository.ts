import { User } from '../../models/User';
import { BaseUserRepository } from './BaseUserRepository';

export class OrderRepository extends BaseUserRepository {
  async addOrder(userId: string, orderId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $addToSet: { orders: orderId } },
      { new: true }
    );
  }
}
