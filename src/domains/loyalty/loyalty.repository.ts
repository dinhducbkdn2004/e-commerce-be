import mongoose from 'mongoose';
import { LoyaltyTransaction, ILoyaltyTransaction } from '../../models/LoyaltyTransaction';
import { User } from '../../models/User';
import { LoyaltyHistoryFilterDTO } from '../../dtos/loyalty.dto';
import { logger } from '../../shared/utils/logger';

export class LoyaltyRepository {

  async createTransaction(transactionData: Partial<ILoyaltyTransaction>): Promise<ILoyaltyTransaction> {
    try {
      const transaction = new LoyaltyTransaction(transactionData);
      await transaction.save();
      return transaction;
    } catch (error) {
      logger.error('Error in createTransaction:', error);
      throw new Error('Failed to create loyalty transaction');
    }
  }

  async getUserLoyaltyStats(userId: string): Promise<any> {
    try {
      const stats = await LoyaltyTransaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalEarned: {
              $sum: { $cond: [{ $gt: ['$points', 0] }, '$points', 0] }
            },
            totalRedeemed: {
              $sum: { $cond: [{ $lt: ['$points', 0] }, { $abs: '$points' }, 0] }
            },
            totalPoints: { $sum: '$points' }
          }
        }
      ]);

      return stats[0] || { totalEarned: 0, totalRedeemed: 0, totalPoints: 0 };
    } catch (error) {
      logger.error('Error in getUserLoyaltyStats:', error);
      throw new Error('Failed to get user loyalty stats');
    }
  }

  async getLoyaltyHistory(userId: string, filters: LoyaltyHistoryFilterDTO): Promise<any> {
    try {
      const query: any = { userId: new mongoose.Types.ObjectId(userId) };
      
      // Apply filters
      if (filters.type) {
        query.type = filters.type;
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

      const transactions = await LoyaltyTransaction.find(query)
        .populate('orderId', 'orderNumber total')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await LoyaltyTransaction.countDocuments(query);
      const pages = Math.ceil(total / limit);

      return {
        transactions,
        pagination: {
          page,
          pages,
          total,
          hasNext: page < pages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      logger.error('Error in getLoyaltyHistory:', error);
      throw new Error('Failed to get loyalty history');
    }
  }

  async updateUserPoints(userId: string, pointsChange: number): Promise<void> {
    try {
      await User.findByIdAndUpdate(
        userId,
        { $inc: { points: pointsChange } },
        { new: true }
      );
    } catch (error) {
      logger.error('Error in updateUserPoints:', error);
      throw new Error('Failed to update user points');
    }
  }

  async getExpiringPoints(userId: string, days: number): Promise<{ points: number; transactions: any[]; nextExpiryDate?: Date }> {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);

      const expiringTransactions = await LoyaltyTransaction.find({
        userId: new mongoose.Types.ObjectId(userId),
        type: 'earn',
        points: { $gt: 0 },
        expiresAt: { $lte: expiryDate, $gte: new Date() }
      })
      .sort({ expiresAt: 1 })
      .lean();

      const totalPoints = expiringTransactions.reduce((sum, t) => sum + t.points, 0);
      const nextExpiryDate = expiringTransactions.length > 0 ? expiringTransactions[0].expiresAt : undefined;

      return {
        points: totalPoints,
        transactions: expiringTransactions,
        nextExpiryDate
      };
    } catch (error) {
      logger.error('Error in getExpiringPoints:', error);
      throw new Error('Failed to get expiring points');
    }
  }

  async getExpiredPoints(): Promise<ILoyaltyTransaction[]> {
    try {
      const now = new Date();
      return await LoyaltyTransaction.find({
        type: 'earn',
        points: { $gt: 0 },
        expiresAt: { $lt: now }
      }).lean();
    } catch (error) {
      logger.error('Error in getExpiredPoints:', error);
      throw new Error('Failed to get expired points');
    }
  }

  async getLoyaltyAnalytics(startDate?: Date, endDate?: Date): Promise<any> {
    try {
      const query: any = {};
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = startDate;
        if (endDate) query.createdAt.$lte = endDate;
      }

      const analytics = await LoyaltyTransaction.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$type',
            totalTransactions: { $sum: 1 },
            totalPoints: { $sum: { $abs: '$points' } },
            averagePoints: { $avg: { $abs: '$points' } }
          }
        }
      ]);

      const userStats = await LoyaltyTransaction.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$userId',
            totalEarned: {
              $sum: { $cond: [{ $gt: ['$points', 0] }, '$points', 0] }
            },
            totalRedeemed: {
              $sum: { $cond: [{ $lt: ['$points', 0] }, { $abs: '$points' }, 0] }
            }
          }
        },
        {
          $group: {
            _id: null,
            activeUsers: { $sum: 1 },
            totalPointsEarned: { $sum: '$totalEarned' },
            totalPointsRedeemed: { $sum: '$totalRedeemed' },
            averagePointsPerUser: { $avg: '$totalEarned' }
          }
        }
      ]);

      return {
        transactionStats: analytics,
        userStats: userStats[0] || {},
        period: { startDate, endDate }
      };
    } catch (error) {
      logger.error('Error in getLoyaltyAnalytics:', error);
      throw new Error('Failed to get loyalty analytics');
    }
  }

  async getTopLoyaltyUsers(limit: number = 10): Promise<any[]> {
    try {
      return await User.find({ points: { $gt: 0 } })
        .select('name email points')
        .sort({ points: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      logger.error('Error in getTopLoyaltyUsers:', error);
      throw new Error('Failed to get top loyalty users');
    }
  }

  async getUserTransactionsByType(userId: string, type: string): Promise<ILoyaltyTransaction[]> {
    try {
      return await LoyaltyTransaction.find({
        userId: new mongoose.Types.ObjectId(userId),
        type
      })
      .sort({ createdAt: -1 })
      .lean();
    } catch (error) {
      logger.error('Error in getUserTransactionsByType:', error);
      throw new Error('Failed to get user transactions by type');
    }
  }

  async getPointsBalance(userId: string): Promise<number> {
    try {
      const result = await LoyaltyTransaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, balance: { $sum: '$points' } } }
      ]);

      return result[0]?.balance || 0;
    } catch (error) {
      logger.error('Error in getPointsBalance:', error);
      throw new Error('Failed to get points balance');
    }
  }
}
