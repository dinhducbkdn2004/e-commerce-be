import { Request, Response } from 'express';
import { AddressService } from './address.service';
import { AddressDTO, UpdateAddressDTO } from '../../dtos/address.dto';
import { ResponseHelper } from '../../shared/utils/ResponseHelper';
import { logger } from '../../shared/utils/logger';
import { AuthenticatedRequest } from '../../shared/types/express';

export class AddressController {
  private addressService: AddressService;

  constructor() {
    this.addressService = new AddressService();
  }

  // Get user's addresses
  async getAddresses(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const addresses = await this.addressService.getAddressesByUserId(userId);
      ResponseHelper.success(res, addresses, 'Addresses retrieved successfully', 'Lấy danh sách địa chỉ thành công');
    } catch (error: any) {
      logger.error('Error getting addresses:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy danh sách địa chỉ');
    }
  }

  // Get address by ID
  async getAddressById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { addressId } = req.params;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const address = await this.addressService.getAddressById(userId, addressId);
      if (!address) {
        ResponseHelper.notFound(res, 'Address not found', 'Không tìm thấy địa chỉ');
        return;
      }

      ResponseHelper.success(res, address, 'Address retrieved successfully', 'Lấy địa chỉ thành công');
    } catch (error: any) {
      logger.error('Error getting address by ID:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy địa chỉ');
    }
  }

  // Add new address
  async addAddress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const addressData: AddressDTO = req.body;
      const newAddress = await this.addressService.addAddress(userId, addressData);
      
      ResponseHelper.created(res, newAddress, 'Address added successfully', 'Thêm địa chỉ thành công');
    } catch (error: any) {
      logger.error('Error adding address:', error);
      ResponseHelper.error(res, error.message, 'Không thể thêm địa chỉ');
    }
  }

  // Update address
  async updateAddress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { addressId } = req.params;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const addressData: AddressDTO = req.body;
      const updatedAddress = await this.addressService.updateAddress(userId, addressId, addressData);
      
      if (!updatedAddress) {
        ResponseHelper.notFound(res, 'Address not found', 'Không tìm thấy địa chỉ');
        return;
      }

      ResponseHelper.success(res, updatedAddress, 'Address updated successfully', 'Cập nhật địa chỉ thành công');
    } catch (error: any) {
      logger.error('Error updating address:', error);
      ResponseHelper.error(res, error.message, 'Không thể cập nhật địa chỉ');
    }
  }

  // Delete address
  async deleteAddress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { addressId } = req.params;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const success = await this.addressService.deleteAddress(userId, addressId);
      
      if (!success) {
        ResponseHelper.notFound(res, 'Address not found', 'Không tìm thấy địa chỉ');
        return;
      }

      ResponseHelper.success(res, null, 'Address deleted successfully', 'Xóa địa chỉ thành công');
    } catch (error: any) {
      logger.error('Error deleting address:', error);
      ResponseHelper.error(res, error.message, 'Không thể xóa địa chỉ');
    }
  }

  // Set default address
  async setDefaultAddress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { addressId } = req.params;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const success = await this.addressService.setDefaultAddress(userId, addressId);
      
      if (!success) {
        ResponseHelper.notFound(res, 'Address not found', 'Không tìm thấy địa chỉ');
        return;
      }

      ResponseHelper.success(res, null, 'Default address set successfully', 'Đặt địa chỉ mặc định thành công');
    } catch (error: any) {
      logger.error('Error setting default address:', error);
      ResponseHelper.error(res, error.message, 'Không thể đặt địa chỉ mặc định');
    }
  }

  // Get default address
  async getDefaultAddress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return;
      }

      const defaultAddress = await this.addressService.getDefaultAddress(userId);
      
      if (!defaultAddress) {
        ResponseHelper.notFound(res, 'No default address found', 'Không tìm thấy địa chỉ mặc định');
        return;
      }

      ResponseHelper.success(res, defaultAddress, 'Default address retrieved successfully', 'Lấy địa chỉ mặc định thành công');
    } catch (error: any) {
      logger.error('Error getting default address:', error);
      ResponseHelper.error(res, error.message, 'Không thể lấy địa chỉ mặc định');
    }
  }
}
