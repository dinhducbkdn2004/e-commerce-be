import { User } from '../../models/User';
import { CreateUserDTO, UpdateUserDTO } from '../../dtos/user.dto';

export class BaseUserRepository {
  async create(data: CreateUserDTO) {
    const user = new User(data);
    return await user.save();
  }

  async findByEmail(email: string) {
    return await User.findOne({ email });
  }

  async findById(id: string) {
    return await User.findById(id);
  }

  async findAll() {
    return await User.find();
  }

  async update(id: string, data: Partial<UpdateUserDTO>) {
    return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string) {
    return await User.findByIdAndDelete(id);
  }
}
