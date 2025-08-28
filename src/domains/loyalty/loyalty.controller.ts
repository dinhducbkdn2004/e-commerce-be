import { Request, Response } from 'express';
import { LoyaltyService } from './loyalty.service';
import { RedeemPointsDTO, LoyaltyHistoryFilterDTO } from '../../dtos/loyalty.dto';
import { ResponseHelper } from '../../shared/utils/ResponseHelper';
import { logger } from '../../shared/utils/logger';
import { AuthenticatedRequest } from '../../shared/types/express';

export class LoyaltyController {
  private loyaltyService: LoyaltyService;

  constructor() {
    this.loyaltyService = new LoyaltyService();
  }

  // Get user's loyalty points and stats
  async getLoyaltyStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const stats = await this.loyaltyService.getLoyaltyStats(userId);
      ResponseHelper.success(res, stats, 'Loyalty stats retrieved successfully', 'Lấy thông tin tích điểm thành công');
    } catch (error: any) {
      logger.error('Error getting loyalty stats:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy thông tin tích điểm');
    }
  }

  // Get loyalty transaction history
  async getLoyaltyHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const filters: LoyaltyHistoryFilterDTO = {
        type: req.query.type as any,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20
      };

      const history = await this.loyaltyService.getLoyaltyHistory(userId, filters);
      ResponseHelper.success(res, history, 'Loyalty history retrieved successfully', 'Lấy lịch sử tích điểm thành công');
    } catch (error: any) {
      logger.error('Error getting loyalty history:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy lịch sử tích điểm');
    }
  }

  // Redeem points
  async redeemPoints(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const redeemData: RedeemPointsDTO = req.body;
      const success = await this.loyaltyService.redeemPoints(userId, redeemData);
      
      if (success) {
        ResponseHelper.success(res, null, 'Points redeemed successfully', 'Quy đổi điểm thành công');
      } else {
        ResponseHelper.badRequest(res, 'Insufficient points or invalid redemption', 'Không đủ điểm hoặc yêu cầu quy đổi không hợp lệ');
      }
    } catch (error: any) {
      logger.error('Error redeeming points:', error);
      ResponseHelper.error(res, error.message, 'Không thể quy đổi điểm');
    }
  }

  // Get points earning rules
  async getEarningRules(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const rules = await this.loyaltyService.getEarningRules();
      ResponseHelper.success(res, rules, 'Earning rules retrieved successfully', 'Lấy quy tắc tích điểm thành công');
    } catch (error: any) {
      logger.error('Error getting earning rules:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy quy tắc tích điểm');
    }
  }

  // Get redemption options
  async getRedemptionOptions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const options = await this.loyaltyService.getRedemptionOptions();
      ResponseHelper.success(res, options, 'Redemption options retrieved successfully', 'Lấy tùy chọn quy đổi thành công');
    } catch (error: any) {
      logger.error('Error getting redemption options:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy tùy chọn quy đổi');
    }
  }

  // Check points expiring soon
  async getExpiringPoints(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const days = parseInt(req.query.days as string) || 30;
      const expiringPoints = await this.loyaltyService.getExpiringPoints(userId, days);
      
      ResponseHelper.success(res, expiringPoints, 'Expiring points retrieved successfully', 'Lấy thông tin điểm sắp hết hạn thành công');
    } catch (error: any) {
      logger.error('Error getting expiring points:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy thông tin điểm sắp hết hạn');
    }
  }

  // Admin: Award points to user
  async awardPoints(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId, points, description, expiresAt } = req.body;
      
      const transaction = await this.loyaltyService.awardPoints(userId, points, description, expiresAt);
      ResponseHelper.success(res, transaction, 'Points awarded successfully', 'Tặng điểm thành công');
    } catch (error: any) {
      logger.error('Error awarding points:', error);
      ResponseHelper.error(res, error.message, 'Không thể tặng điểm');
    }
  }

  // Admin: Get loyalty analytics
  async getLoyaltyAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      const analytics = await this.loyaltyService.getLoyaltyAnalytics(startDate, endDate);
      ResponseHelper.success(res, analytics, 'Loyalty analytics retrieved successfully', 'Lấy thống kê tích điểm thành công');
    } catch (error: any) {
      logger.error('Error getting loyalty analytics:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy thống kê tích điểm');
    }
  }
}
