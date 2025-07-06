import request from 'supertest';
import app from '../../app';
import { User } from '../../models/User';

describe('User API Integration Tests', () => {
  describe('POST /api/v1/users', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        username: 'integrationtest',
        password: 'password123',
        role: 'user',
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.username).toBe(userData.username);
      expect(response.body.data.role).toBe(userData.role);
      expect(response.body.data.password).toBeUndefined();
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        username: '', // Empty username
        password: 'short', // Short password
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(invalidData)
        .expect(400);

      expect(response.body.status).toBe('error');
    });

    it('should return 409 for duplicate username', async () => {
      const userData = {
        username: 'duplicate',
        password: 'password123',
        role: 'user',
      };

      // Create first user
      await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(409);

      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/api/v1/users')
        .send({
          username: 'logintest',
          password: 'password123',
          role: 'user',
        });
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'logintest',
          password: 'password123',
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.username).toBe('logintest');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'logintest',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.status).toBe('error');
    });

    it('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({})
        .expect(400);

      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body.message).toBe('Welcome to My Backend API');
      expect(response.body.endpoints).toBeDefined();
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
      expect(response.body.memory).toBeDefined();
    });
  });

  describe('404 Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('not found');
      expect(response.body.availableRoutes).toBeDefined();
    });
  });
});
