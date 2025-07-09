import { User } from '../models/User';
import { CreateUserDTO } from '../dtos/user.dto';

export class UserRepository {
  async create(data: CreateUserDTO) {
    const user = new User(data);
    return await user.save();
  }

  async findByUsername(username: string) {
    return await User.findOne({ username });
  }

  async findById(id: string) {
    return await User.findById(id);
  }

  async findAll() {
    return await User.find();
  }

  async update(id: string, data: Partial<CreateUserDTO>) {
    return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string) {
    return await User.findByIdAndDelete(id);
  }
}
