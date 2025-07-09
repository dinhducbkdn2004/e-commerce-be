import { UserRepository } from '../../repositories/UserRepository';
import { AddressDTO } from '../../dtos/user.dto';
import { AppError } from '../../middlewares/errorHandler';
import { logger } from '../../utils/logger';
import { BaseUserService } from './BaseUserService';

export class AddressService extends BaseUserService {
    async addAddress(userId: string, address: AddressDTO) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const updatedUser = await this.userRepo.addAddress(userId, address);
            if (!updatedUser) {
                throw new AppError('Failed to add address', 500);
            }

            return { 
                message: 'Address added successfully',
                addresses: updatedUser.addresses
            };
        } catch (error) {
            logger.error('Error adding address', {
                userId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Failed to add address', 500);
        }
    }

    async updateAddress(userId: string, addressId: string, addressData: Partial<AddressDTO>) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const addressExists = user.addresses.some(addr => addr._id ? addr._id.toString() === addressId : false);
            if (!addressExists) {
                throw new AppError('Address not found', 404);
            }

            const updatedUser = await this.userRepo.updateAddress(userId, addressId, addressData);
            if (!updatedUser) {
                throw new AppError('Failed to update address', 500);
            }

            return {
                message: 'Address updated successfully',
                addresses: updatedUser.addresses
            };
        } catch (error) {
            logger.error('Error updating address', {
                userId,
                addressId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Failed to update address', 500);
        }
    }

    async removeAddress(userId: string, addressId: string) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const addressExists = user.addresses.some(addr => addr._id ? addr._id.toString() === addressId : false);
            if (!addressExists) {
                throw new AppError('Address not found', 404);
            }

            const updatedUser = await this.userRepo.removeAddress(userId, addressId);
            
            return {
                message: 'Address removed successfully',
                addresses: updatedUser?.addresses || []
            };
        } catch (error) {
            logger.error('Error removing address', {
                userId,
                addressId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new AppError('Failed to remove address', 500);
        }
    }
}
