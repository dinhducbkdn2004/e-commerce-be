import { UserService } from '../../services/UserService';
import { UserRepository } from '../../repositories/UserRepository';
import { CreateUserDTO } from '../../dtos/user.dto';
import { AppError } from '../../middlewares/errorHandler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../repositories/UserRepository');

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userService = new UserService();
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    (userService as any).userRepo = mockUserRepository;
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData: CreateUserDTO = {
        username: 'testuser',
        password: 'password123',
        role: 'user',
      };

      const hashedPassword = 'hashedpassword123';
      const mockUser = {
        _id: 'user123',
        username: userData.username,
        password: hashedPassword,
        role: userData.role,
        toObject: jest.fn().mockReturnValue({
          _id: 'user123',
          username: userData.username,
          password: hashedPassword,
          role: userData.role,
        }),
      };

      mockUserRepository.findByUsername.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(mockUser as any);

      const result = await userService.createUser(userData);

      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(userData.username);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 12);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
      });
      expect(result).toEqual({
        _id: 'user123',
        username: userData.username,
        role: userData.role,
      });
    });

    it('should throw error when username already exists', async () => {
      const userData: CreateUserDTO = {
        username: 'existinguser',
        password: 'password123',
        role: 'user',
      };

      mockUserRepository.findByUsername.mockResolvedValue({} as any);

      await expect(userService.createUser(userData)).rejects.toThrow(
        new AppError('Username already exists', 409)
      );
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const username = 'testuser';
      const password = 'password123';
      const mockUser = {
        _id: 'user123',
        username,
        password: 'hashedpassword123',
        role: 'user',
      };

      mockUserRepository.findByUsername.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mocktoken123');

      const result = await userService.login(username, password);

      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toEqual({
        token: 'mocktoken123',
        user: {
          id: mockUser._id,
          username: mockUser.username,
          role: mockUser.role,
        },
      });
    });

    it('should throw error with invalid credentials', async () => {
      const username = 'testuser';
      const password = 'wrongpassword';

      mockUserRepository.findByUsername.mockResolvedValue(null);

      await expect(userService.login(username, password)).rejects.toThrow(
        new AppError('Invalid credentials', 401)
      );
    });
  });
});
