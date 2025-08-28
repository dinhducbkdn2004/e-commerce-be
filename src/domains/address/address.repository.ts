import mongoose from 'mongoose';
import { User } from '../../models/User';
import { AddressDTO } from '../../dtos/address.dto';
import { IAddress } from '../../models/Address';
import { logger } from '../../shared/utils/logger';

export class AddressRepository {

  async getAddressesByUserId(userId: string): Promise<IAddress[]> {
    try {
      const user = await User.findById(userId).lean();
      if (!user || !user.addresses) {
        return [];
      }
      return user.addresses;
    } catch (error) {
      logger.error('Error in getAddressesByUserId:', error);
      throw new Error('Failed to get user addresses');
    }
  }

  async getAddressById(userId: string, addressId: string): Promise<IAddress | null> {
    try {
      const user = await User.findOne({
        _id: userId,
        'addresses._id': addressId
      }).lean();

      if (!user || !user.addresses) {
        return null;
      }

      const address = user.addresses.find((addr: any) => addr._id.toString() === addressId);
      return address || null;
    } catch (error) {
      logger.error('Error in getAddressById:', error);
      throw new Error('Failed to get address');
    }
  }

  async addAddress(userId: string, addressData: AddressDTO): Promise<IAddress> {
    try {
      const newAddress: IAddress = {
        _id: new mongoose.Types.ObjectId(),
        fullName: addressData.fullName,
        phone: addressData.phone,
        street: addressData.street,
        ward: addressData.ward,
        district: addressData.district,
        city: addressData.city,
        isDefault: addressData.isDefault || false
      };

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { addresses: newAddress } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return newAddress;
    } catch (error) {
      logger.error('Error in addAddress:', error);
      throw error;
    }
  }

  async updateAddress(userId: string, addressId: string, addressData: AddressDTO): Promise<IAddress | null> {
    try {
      const updateFields: any = {};
      if (addressData.fullName !== undefined) updateFields['addresses.$.fullName'] = addressData.fullName;
      if (addressData.phone !== undefined) updateFields['addresses.$.phone'] = addressData.phone;
      if (addressData.street !== undefined) updateFields['addresses.$.street'] = addressData.street;
      if (addressData.ward !== undefined) updateFields['addresses.$.ward'] = addressData.ward;
      if (addressData.district !== undefined) updateFields['addresses.$.district'] = addressData.district;
      if (addressData.city !== undefined) updateFields['addresses.$.city'] = addressData.city;
      if (addressData.isDefault !== undefined) updateFields['addresses.$.isDefault'] = addressData.isDefault;

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId, 'addresses._id': addressId },
        { $set: updateFields },
        { new: true }
      );

      if (!updatedUser || !updatedUser.addresses) {
        return null;
      }

      const updatedAddress = updatedUser.addresses.find((addr: any) => addr._id.toString() === addressId);
      return updatedAddress || null;
    } catch (error) {
      logger.error('Error in updateAddress:', error);
      throw error;
    }
  }

  async deleteAddress(userId: string, addressId: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndUpdate(
        userId,
        { $pull: { addresses: { _id: addressId } } },
        { new: true }
      );

      return !!result;
    } catch (error) {
      logger.error('Error in deleteAddress:', error);
      throw error;
    }
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<boolean> {
    try {
      const result = await User.findOneAndUpdate(
        { _id: userId, 'addresses._id': addressId },
        { $set: { 'addresses.$.isDefault': true } },
        { new: true }
      );

      return !!result;
    } catch (error) {
      logger.error('Error in setDefaultAddress:', error);
      throw error;
    }
  }

  async unsetDefaultAddress(userId: string): Promise<void> {
    try {
      await User.findByIdAndUpdate(
        userId,
        { $set: { 'addresses.$[].isDefault': false } },
        { new: true }
      );
    } catch (error) {
      logger.error('Error in unsetDefaultAddress:', error);
      throw error;
    }
  }

  async getDefaultAddress(userId: string): Promise<IAddress | null> {
    try {
      const user = await User.findOne({
        _id: userId,
        'addresses.isDefault': true
      }).lean();

      if (!user || !user.addresses) {
        return null;
      }

      const defaultAddress = user.addresses.find((addr: any) => addr.isDefault);
      return defaultAddress || null;
    } catch (error) {
      logger.error('Error in getDefaultAddress:', error);
      throw new Error('Failed to get default address');
    }
  }

  async countUserAddresses(userId: string): Promise<number> {
    try {
      const user = await User.findById(userId).lean();
      return user?.addresses?.length || 0;
    } catch (error) {
      logger.error('Error in countUserAddresses:', error);
      throw new Error('Failed to count user addresses');
    }
  }
}
