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
}
