import { UserRepository } from '../../repositories/UserRepository';
import { AppError } from '../../middlewares/errorHandler';
import { logger } from '../../utils/logger';
import { BaseUserService } from './BaseUserService';

export class LoyaltyService extends BaseUserService {
    async updatePoints(userId: string, points: number) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }
            
            const updatedUser = await this.userRepo.updatePoints(userId, points);
            
            return {
                message: points >= 0 ? 'Points added successfully' : 'Points deducted successfully',
                currentPoints: updatedUser?.points || 0
            };
        } catch (error) {
            logger.error('Error updating points', {
                userId,
                points,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Failed to update points', 500);
        }
    }

    async addVoucher(userId: string, voucherId: string) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }
            
            const updatedUser = await this.userRepo.addVoucher(userId, voucherId);
            
            return {
                message: 'Voucher added successfully',
                vouchers: updatedUser?.vouchers || []
            };
        } catch (error) {
            logger.error('Error adding voucher', {
                userId,
                voucherId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Failed to add voucher', 500);
        }
    }

    async removeVoucher(userId: string, voucherId: string) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }
            
            const updatedUser = await this.userRepo.removeVoucher(userId, voucherId);
            
            return {
                message: 'Voucher removed successfully',
                vouchers: updatedUser?.vouchers || []
            };
        } catch (error) {
            logger.error('Error removing voucher', {
                userId,
                voucherId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Failed to remove voucher', 500);
        }
    }
}
