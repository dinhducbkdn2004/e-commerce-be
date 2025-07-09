import { UserRepository } from '../../repositories/UserRepository';
import { AppError } from '../../middlewares/errorHandler';
import { logger } from '../../utils/logger';
import { BaseUserService } from './BaseUserService';

export class OrderService extends BaseUserService {
    async addOrder(userId: string, orderId: string) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }
            
            const updatedUser = await this.userRepo.addOrder(userId, orderId);
            
            return {
                message: 'Order added to user history',
                orders: updatedUser?.orders || []
            };
        } catch (error) {
            logger.error('Error adding order to user history', {
                userId,
                orderId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Failed to add order to user history', 500);
        }
    }
}
