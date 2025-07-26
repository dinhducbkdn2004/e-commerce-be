import mongoose from 'mongoose';
import app from './app';
import { config } from './shared/config';
import { logger } from './shared/utils/logger';

// Connect to MongoDB
mongoose.connect(config.MONGO_URI)
  .then(() => logger.info('🍃 MongoDB connected successfully'))
  .catch(err => logger.error('❌ MongoDB connection failed:', err));

// Start the server
const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`🌍 Environment: ${config.NODE_ENV}`);
  logger.info(`📝 Log level: ${config.LOG_LEVEL}`);
});