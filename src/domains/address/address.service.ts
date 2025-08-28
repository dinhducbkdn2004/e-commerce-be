import { AddressRepository } from './address.repository';
import { AddressDTO } from '../../dtos/address.dto';
import { IAddress } from '../../models/Address';
import { logger } from '../../shared/utils/logger';

export class AddressService {
  private addressRepository: AddressRepository;

  constructor() {
    this.addressRepository = new AddressRepository();
  }

  async getAddressesByUserId(userId: string): Promise<IAddress[]> {
    try {
      return await this.addressRepository.getAddressesByUserId(userId);
    } catch (error) {
      logger.error('Error in getAddressesByUserId:', error);
      throw error;
    }
  }

  async getAddressById(userId: string, addressId: string): Promise<IAddress | null> {
    try {
      return await this.addressRepository.getAddressById(userId, addressId);
    } catch (error) {
      logger.error('Error in getAddressById:', error);
      throw error;
    }
  }

  async addAddress(userId: string, addressData: AddressDTO): Promise<IAddress> {
    try {
      // If this is the first address or marked as default, set it as default
      const existingAddresses = await this.addressRepository.getAddressesByUserId(userId);
      const isFirstAddress = existingAddresses.length === 0;
      
      const addressToAdd = {
        ...addressData,
        isDefault: addressData.isDefault || isFirstAddress
      };

      // If setting as default, unset current default
      if (addressToAdd.isDefault) {
        await this.addressRepository.unsetDefaultAddress(userId);
      }

      return await this.addressRepository.addAddress(userId, addressToAdd);
    } catch (error) {
      logger.error('Error in addAddress:', error);
      throw error;
    }
  }

  async updateAddress(userId: string, addressId: string, addressData: AddressDTO): Promise<IAddress | null> {
    try {
      // If setting as default, unset current default first
      if (addressData.isDefault) {
        await this.addressRepository.unsetDefaultAddress(userId);
      }

      return await this.addressRepository.updateAddress(userId, addressId, addressData);
    } catch (error) {
      logger.error('Error in updateAddress:', error);
      throw error;
    }
  }

  async deleteAddress(userId: string, addressId: string): Promise<boolean> {
    try {
      // Check if this is the default address
      const address = await this.addressRepository.getAddressById(userId, addressId);
      const isDefault = address?.isDefault;

      const success = await this.addressRepository.deleteAddress(userId, addressId);
      
      // If we deleted the default address, set another one as default if available
      if (success && isDefault) {
        const remainingAddresses = await this.addressRepository.getAddressesByUserId(userId);
        if (remainingAddresses.length > 0) {
          await this.addressRepository.setDefaultAddress(userId, remainingAddresses[0]._id!.toString());
        }
      }

      return success;
    } catch (error) {
      logger.error('Error in deleteAddress:', error);
      throw error;
    }
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<boolean> {
    try {
      // First unset current default
      await this.addressRepository.unsetDefaultAddress(userId);
      
      // Then set new default
      return await this.addressRepository.setDefaultAddress(userId, addressId);
    } catch (error) {
      logger.error('Error in setDefaultAddress:', error);
      throw error;
    }
  }

  async getDefaultAddress(userId: string): Promise<IAddress | null> {
    try {
      return await this.addressRepository.getDefaultAddress(userId);
    } catch (error) {
      logger.error('Error in getDefaultAddress:', error);
      throw error;
    }
  }

  async validateAddress(addressData: AddressDTO): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!addressData.fullName || addressData.fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters');
    }

    if (!addressData.phone || !/^(\+84|0)[0-9]{9,10}$/.test(addressData.phone.replace(/\s/g, ''))) {
      errors.push('Invalid Vietnamese phone number format');
    }

    if (!addressData.street || addressData.street.trim().length < 5) {
      errors.push('Street address must be at least 5 characters');
    }

    if (!addressData.ward || addressData.ward.trim().length < 2) {
      errors.push('Ward is required');
    }

    if (!addressData.district || addressData.district.trim().length < 2) {
      errors.push('District is required');
    }

    if (!addressData.city || addressData.city.trim().length < 2) {
      errors.push('City is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
