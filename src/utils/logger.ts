import winston from 'winston';
import { config } from '../config';

// Custom format for console logging
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    const stackString = stack ? `\n${stack}` : '';
    return `🚀 [${timestamp}] ${level.toUpperCase()}: ${message}${metaString}${stackString}`;
  })
);

// Custom format for file logging
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      format: fileFormat
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      format: fileFormat
    }),
  ],
});

// Add console transport for development
if (config.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Request logger stream for Morgan
export const requestLoggerStream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};