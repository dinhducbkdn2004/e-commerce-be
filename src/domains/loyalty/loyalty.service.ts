import { LoyaltyRepository } from './loyalty.repository';
import { RedeemPointsDTO, LoyaltyHistoryFilterDTO, LoyaltyStatsDTO } from '../../dtos/loyalty.dto';
import { ILoyaltyTransaction } from '../../models/LoyaltyTransaction';
import { logger } from '../../shared/utils/logger';

export class LoyaltyService {
  private loyaltyRepository: LoyaltyRepository;

  // Loyalty program configuration
  private readonly POINTS_PER_VND = 0.01; // 1 point per 100 VND spent
  private readonly POINTS_EXPIRY_MONTHS = 12; // Points expire after 12 months
  private readonly MINIMUM_REDEMPTION = 100; // Minimum 100 points to redeem
  private readonly REDEMPTION_VALUE = 1000; // 100 points = 1000 VND

  constructor() {
    this.loyaltyRepository = new LoyaltyRepository();
  }

  async getLoyaltyStats(userId: string): Promise<LoyaltyStatsDTO> {
    try {
      const stats = await this.loyaltyRepository.getUserLoyaltyStats(userId);
      const expiringInfo = await this.loyaltyRepository.getExpiringPoints(userId, 30);
      
      return {
        totalPoints: stats.totalPoints || 0,
        totalEarned: stats.totalEarned || 0,
        totalRedeemed: stats.totalRedeemed || 0,
        expiringPoints: expiringInfo.points || 0,
        expiringDate: expiringInfo.nextExpiryDate,
        tierStatus: this.calculateTierStatus(stats.totalEarned || 0),
        nextTierPoints: this.calculateNextTierPoints(stats.totalEarned || 0)
      };
    } catch (error) {
      logger.error('Error in getLoyaltyStats:', error);
      throw error;
    }
  }

  async getLoyaltyHistory(userId: string, filters: LoyaltyHistoryFilterDTO): Promise<any> {
    try {
      return await this.loyaltyRepository.getLoyaltyHistory(userId, filters);
    } catch (error) {
      logger.error('Error in getLoyaltyHistory:', error);
      throw error;
    }
  }

  async earnPointsFromOrder(userId: string, orderTotal: number, orderId: string): Promise<ILoyaltyTransaction | null> {
    try {
      const pointsToEarn = Math.floor(orderTotal * this.POINTS_PER_VND);
      
      if (pointsToEarn <= 0) {
        return null;
      }

      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + this.POINTS_EXPIRY_MONTHS);

      const transaction = await this.loyaltyRepository.createTransaction({
        userId,
        type: 'earn',
        points: pointsToEarn,
        description: `Earned ${pointsToEarn} points from order`,
        orderId,
        expiresAt
      });

      // Update user's total points
      await this.loyaltyRepository.updateUserPoints(userId, pointsToEarn);

      logger.info(`User ${userId} earned ${pointsToEarn} points from order ${orderId}`);
      return transaction;
    } catch (error) {
      logger.error('Error in earnPointsFromOrder:', error);
      throw error;
    }
  }

  async redeemPoints(userId: string, redeemData: RedeemPointsDTO): Promise<boolean> {
    try {
      // Check if user has enough points
      const userStats = await this.loyaltyRepository.getUserLoyaltyStats(userId);
      
      if (!userStats || userStats.totalPoints < redeemData.points) {
        throw new Error('Insufficient points');
      }

      if (redeemData.points < this.MINIMUM_REDEMPTION) {
        throw new Error(`Minimum redemption is ${this.MINIMUM_REDEMPTION} points`);
      }

      // Create redemption transaction
      await this.loyaltyRepository.createTransaction({
        userId,
        type: 'redeem',
        points: -redeemData.points, // Negative for redemption
        description: redeemData.description || `Redeemed ${redeemData.points} points`,
        orderId: redeemData.orderId
      });

      // Update user's total points
      await this.loyaltyRepository.updateUserPoints(userId, -redeemData.points);

      logger.info(`User ${userId} redeemed ${redeemData.points} points`);
      return true;
    } catch (error) {
      logger.error('Error in redeemPoints:', error);
      throw error;
    }
  }

  async awardPoints(userId: string, points: number, description: string, expiresAt?: Date): Promise<ILoyaltyTransaction> {
    try {
      const expiry = expiresAt || new Date(Date.now() + this.POINTS_EXPIRY_MONTHS * 30 * 24 * 60 * 60 * 1000);

      const transaction = await this.loyaltyRepository.createTransaction({
        userId,
        type: 'earn',
        points,
        description,
        expiresAt: expiry
      });

      // Update user's total points
      await this.loyaltyRepository.updateUserPoints(userId, points);

      logger.info(`Awarded ${points} points to user ${userId}: ${description}`);
      return transaction;
    } catch (error) {
      logger.error('Error in awardPoints:', error);
      throw error;
    }
  }

  async getExpiringPoints(userId: string, days: number): Promise<{ points: number; transactions: any[] }> {
    try {
      return await this.loyaltyRepository.getExpiringPoints(userId, days);
    } catch (error) {
      logger.error('Error in getExpiringPoints:', error);
      throw error;
    }
  }

  async expirePoints(): Promise<number> {
    try {
      const expiredTransactions = await this.loyaltyRepository.getExpiredPoints();
      let totalExpired = 0;

      for (const transaction of expiredTransactions) {
        // Create expiry transaction
        await this.loyaltyRepository.createTransaction({
          userId: transaction.userId,
          type: 'expire',
          points: -transaction.points,
          description: `Points expired from ${transaction.description}`
        });

        // Update user's total points
        await this.loyaltyRepository.updateUserPoints(transaction.userId, -transaction.points);
        totalExpired += transaction.points;
      }

      logger.info(`Expired ${totalExpired} points across ${expiredTransactions.length} transactions`);
      return totalExpired;
    } catch (error) {
      logger.error('Error in expirePoints:', error);
      throw error;
    }
  }

  async getEarningRules(): Promise<any> {
    return {
      pointsPerVND: this.POINTS_PER_VND,
      pointsPerDollar: this.POINTS_PER_VND * 24000, // Approximate exchange rate
      expiryMonths: this.POINTS_EXPIRY_MONTHS,
      bonusRules: [
        { condition: 'First order', points: 100 },
        { condition: 'Order above 1,000,000 VND', bonusMultiplier: 2 },
        { condition: 'Birthday month', bonusMultiplier: 1.5 }
      ]
    };
  }

  async getRedemptionOptions(): Promise<any> {
    return [
      {
        type: 'discount',
        name: 'Discount Voucher',
        options: [
          { points: 100, value: 10000, description: '10,000 VND discount' },
          { points: 500, value: 60000, description: '60,000 VND discount' },
          { points: 1000, value: 150000, description: '150,000 VND discount' }
        ]
      },
      {
        type: 'shipping',
        name: 'Free Shipping',
        options: [
          { points: 50, description: 'Free standard shipping' },
          { points: 100, description: 'Free express shipping' }
        ]
      }
    ];
  }

  async getLoyaltyAnalytics(startDate?: Date, endDate?: Date): Promise<any> {
    try {
      return await this.loyaltyRepository.getLoyaltyAnalytics(startDate, endDate);
    } catch (error) {
      logger.error('Error in getLoyaltyAnalytics:', error);
      throw error;
    }
  }

  // Helper methods
  private calculateTierStatus(totalEarned: number): string {
    if (totalEarned >= 10000) return 'Platinum';
    if (totalEarned >= 5000) return 'Gold';
    if (totalEarned >= 2000) return 'Silver';
    return 'Bronze';
  }

  private calculateNextTierPoints(totalEarned: number): number {
    if (totalEarned >= 10000) return 0; // Max tier
    if (totalEarned >= 5000) return 10000 - totalEarned;
    if (totalEarned >= 2000) return 5000 - totalEarned;
    return 2000 - totalEarned;
  }

  async calculatePointsFromAmount(amount: number): Promise<number> {
    return Math.floor(amount * this.POINTS_PER_VND);
  }

  async calculateRedemptionValue(points: number): Promise<number> {
    return Math.floor(points * (this.REDEMPTION_VALUE / 100));
  }
}
