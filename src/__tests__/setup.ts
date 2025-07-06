import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
  
  // Import models to ensure they are registered
  await import('../models/User');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

beforeEach(async () => {
  // Ensure indexes are created for each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.dropIndexes();
  }
  
  // Rebuild all model indexes
  await Promise.all(
    Object.values(mongoose.models).map(model => model.ensureIndexes())
  );
});

// Mock logger to avoid console spam during tests
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// This is required to make Jest happy
describe('Test Setup', () => {
  it('should be configured properly', () => {
    expect(true).toBe(true);
  });
});
