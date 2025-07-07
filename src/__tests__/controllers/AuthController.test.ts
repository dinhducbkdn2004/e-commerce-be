import { Request, Response, NextFunction } from 'express';
import { AuthController } from '../../controllers/AuthController';
import { UserService } from '../../services/UserService';
import { AppError } from '../../middlewares/errorHandler';
import { Types } from 'mongoose';

jest.mock('../../services/UserService');

describe('AuthController', () => {
  let authController: AuthController;
  let mockUserService: jest.Mocked<UserService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    authController = new AuthController();
    mockUserService = new UserService() as jest.Mocked<UserService>;
    (authController as any).userService = mockUserService;

    mockRequest = {
      body: {},
      ip: '127.0.0.1',
      get: jest.fn(),
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const loginData = {
        username: 'testuser',
        password: 'password123',
      };

      const loginResult = {
        user: {
          id: new Types.ObjectId(),
          username: loginData.username,
          role: 'user' as 'user' | 'admin',
        },
        token: 'jwt_token_here',
      };

      mockRequest.body = loginData;
      mockUserService.login.mockResolvedValue(loginResult);

      await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockUserService.login).toHaveBeenCalledWith(loginData.username, loginData.password);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: loginResult,
      });
    });

    it('should handle login error', async () => {
      const loginData = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      const error = new AppError('Invalid credentials', 401);

      mockRequest.body = loginData;
      mockUserService.login.mockRejectedValue(error);

      await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockUserService.login).toHaveBeenCalledWith(loginData.username, loginData.password);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
