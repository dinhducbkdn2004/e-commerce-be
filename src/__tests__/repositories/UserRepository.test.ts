import { UserRepository } from '../../repositories/UserRepository';
import { CreateUserDTO } from '../../dtos/user.dto';
import { User } from '../../models/User';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const userData: CreateUserDTO = {
        username: 'testuser',
        password: 'hashedpassword123',
        role: 'user',
      };

      const user = await userRepository.create(userData);

      expect(user).toBeDefined();
      expect(user.username).toBe(userData.username);
      expect(user.password).toBe(userData.password);
      expect(user.role).toBe(userData.role);
      expect(user._id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should throw error when creating user with duplicate username', async () => {
      const userData: CreateUserDTO = {
        username: 'testuser',
        password: 'hashedpassword123',
        role: 'user',
      };

      await userRepository.create(userData);

      await expect(userRepository.create(userData)).rejects.toThrow(/duplicate/i);
    });
  });

  describe('findByUsername', () => {
    it('should find existing user by username', async () => {
      const userData: CreateUserDTO = {
        username: 'findtest',
        password: 'hashedpassword123',
        role: 'user',
      };

      const createdUser = await userRepository.create(userData);
      const foundUser = await userRepository.findByUsername('findtest');

      expect(foundUser).toBeDefined();
      expect(foundUser?.username).toBe(userData.username);
      expect(foundUser?._id.toString()).toBe(createdUser._id.toString());
    });

    it('should return null for non-existing username', async () => {
      const foundUser = await userRepository.findByUsername('nonexisting');

      expect(foundUser).toBeNull();
    });
  });
});
