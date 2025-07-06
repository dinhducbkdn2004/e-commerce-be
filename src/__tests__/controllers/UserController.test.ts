import { Request, Response, NextFunction } from 'express';
import { UserController } from '../../controllers/UserController';
import { UserService } from '../../services/UserService';
import { AppError } from '../../middlewares/errorHandler';

jest.mock('../../services/UserService');

describe('UserController', () => {
  let userController: UserController;
  let mockUserService: jest.Mocked<UserService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    userController = new UserController();
    mockUserService = new UserService() as jest.Mocked<UserService>;
    (userController as any).userService = mockUserService;

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

  describe('create', () => {
    it('should create user successfully', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        role: 'user',
      };

      const createdUser = {
        _id: 'user123',
        username: userData.username,
        role: userData.role,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      } as any;

      mockRequest.body = userData;
      mockUserService.createUser.mockResolvedValue(createdUser);

      await userController.create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockUserService.createUser).toHaveBeenCalledWith(userData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: createdUser,
      });
    });

    it('should handle creation error', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        role: 'user',
      };

      const error = new AppError('Username already exists', 409);
      mockRequest.body = userData;
      mockUserService.createUser.mockRejectedValue(error);

      await userController.create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
