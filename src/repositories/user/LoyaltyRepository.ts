import { User } from '../../models/User';
import { BaseUserRepository } from './BaseUserRepository';

export class LoyaltyRepository extends BaseUserRepository {
  async updatePoints(userId: string, points: number) {
    return await User.findByIdAndUpdate(
      userId,
      { $inc: { points } },
      { new: true }
    );
  }

  async addVoucher(userId: string, voucherId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $addToSet: { vouchers: voucherId } },
      { new: true }
    );
  }

  async removeVoucher(userId: string, voucherId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { vouchers: voucherId } },
      { new: true }
    );
  }
}
