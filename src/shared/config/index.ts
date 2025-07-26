import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

// Validate required environment variables
requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
});

export const config = {
    MONGO_URI: process.env.MONGO_URI!,
    PORT: parseInt(process.env.PORT || '3000'),
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
    JWT_EXPIRES_IN_REFRESH: process.env.JWT_EXPIRES_IN_REFRESH || '7d',
    
    // Database
    DB_MAX_CONNECTIONS: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
    
    // Security
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    RATE_LIMIT_REQUESTS: parseInt(process.env.RATE_LIMIT_REQUESTS || '100'),
    CSRF_SECRET: process.env.CSRF_SECRET || 'default-csrf-secret',
    SESSION_SECRET: process.env.SESSION_SECRET || 'default-session-secret',
    
    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
} as const;