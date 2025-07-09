import { User } from '../../models/User';
import { AddressDTO } from '../../dtos/user.dto';
import { BaseUserRepository } from './BaseUserRepository';

export class AddressRepository extends BaseUserRepository {
  async addAddress(userId: string, address: AddressDTO) {
    // If this is set as default, unset any current default
    if (address.isDefault) {
      await User.updateOne(
        { _id: userId },
        { $set: { "addresses.$[].isDefault": false } }
      );
    }
    
    return await User.findByIdAndUpdate(
      userId,
      { $push: { addresses: address } },
      { new: true, runValidators: true }
    );
  }

  async updateAddress(userId: string, addressId: string, addressData: Partial<AddressDTO>) {
    // If this is set as default, unset any current default
    if (addressData.isDefault) {
      await User.updateOne(
        { _id: userId },
        { $set: { "addresses.$[].isDefault": false } }
      );
    }

    // Build the update object dynamically based on provided fields
    const updateFields: Record<string, any> = {};
    Object.keys(addressData).forEach(key => {
      updateFields[`addresses.$.${key}`] = (addressData as any)[key];
    });
    
    return await User.findOneAndUpdate(
      { _id: userId, "addresses._id": addressId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );
  }

  async removeAddress(userId: string, addressId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );
  }
}
