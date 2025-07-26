import { User } from '../../models/User';
import { UpdateUserDTO } from '../../dtos/user.dto';

export class UserRepository {
  async findAll() {
    return await User.find({ isActive: true }).select('-password -refreshTokens');
  }

  async findById(id: string) {
    return await User.findById(id);
  }

  async findByEmail(email: string) {
    return await User.findOne({ email });
  }

  async update(id: string, data: Partial<UpdateUserDTO>) {
    return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string) {
    return await User.findByIdAndDelete(id);
  }

  async searchUsers(query: string) {
    const searchRegex = new RegExp(query, 'i');
    return await User.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: searchRegex } },
            { email: { $regex: searchRegex } }
          ]
        }
      ]
    }).select('-password -refreshTokens');
  }

  async findByRole(role: string) {
    return await User.find({ role, isActive: true }).select('-password -refreshTokens');
  }

  async countUsers() {
    return await User.countDocuments({ isActive: true });
  }

  async findRecentUsers(limit: number = 10) {
    return await User.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-password -refreshTokens');
  }
} 