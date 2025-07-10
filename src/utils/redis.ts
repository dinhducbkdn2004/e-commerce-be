import Redis from 'ioredis';
import { logger } from './logger';

class RedisClient {
    private client: Redis;
    private isConnected: boolean = false;

    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
            db: parseInt(process.env.REDIS_DB || '0'),
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
            lazyConnect: true
        });

        this.client.on('connect', () => {
            logger.info('Redis connected successfully');
            this.isConnected = true;
        });

        this.client.on('error', (err) => {
            logger.error('Redis connection error', { error: err.message });
            this.isConnected = false;
        });

        this.client.on('close', () => {
            logger.warn('Redis connection closed');
            this.isConnected = false;
        });

        this.client.on('reconnecting', () => {
            logger.info('Redis reconnecting...');
        });
    }

    async connect(): Promise<void> {
        // Skip Redis connection in development if not needed
        if (process.env.NODE_ENV === 'development' && !process.env.REDIS_REQUIRED) {
            logger.info('Redis connection skipped in development mode');
            return;
        }

        try {
            await this.client.connect();
        } catch (error) {
            logger.error('Failed to connect to Redis', { error });
            // Don't throw error, allow app to continue without Redis
        }
    }

    async disconnect(): Promise<void> {
        try {
            await this.client.disconnect();
        } catch (error) {
            logger.error('Failed to disconnect from Redis', { error });
        }
    }

    async blacklistToken(tokenId: string, expiresIn: number): Promise<void> {
        if (!this.isConnected) {
            logger.warn('Redis not connected, cannot blacklist token');
            return;
        }

        try {
            await this.client.setex(`blacklist:${tokenId}`, expiresIn, 'revoked');
            logger.info('Token blacklisted successfully', { tokenId });
        } catch (error) {
            logger.error('Failed to blacklist token', { tokenId, error });
        }
    }

    async isTokenBlacklisted(tokenId: string): Promise<boolean> {
        if (!this.isConnected) {
            logger.warn('Redis not connected, cannot check blacklist');
            return false;
        }

        try {
            const result = await this.client.get(`blacklist:${tokenId}`);
            return result !== null;
        } catch (error) {
            logger.error('Failed to check token blacklist', { tokenId, error });
            return false;
        }
    }

    async blacklistAllUserTokens(userId: string, expiresIn: number): Promise<void> {
        if (!this.isConnected) {
            logger.warn('Redis not connected, cannot blacklist user tokens');
            return;
        }

        try {
            await this.client.setex(`user_blacklist:${userId}`, expiresIn, new Date().toISOString());
            logger.info('All user tokens blacklisted successfully', { userId });
        } catch (error) {
            logger.error('Failed to blacklist all user tokens', { userId, error });
        }
    }

    async isUserTokensBlacklisted(userId: string, tokenIssuedAt: number): Promise<boolean> {
        if (!this.isConnected) {
            logger.warn('Redis not connected, cannot check user blacklist');
            return false;
        }

        try {
            const blacklistTime = await this.client.get(`user_blacklist:${userId}`);
            if (!blacklistTime) return false;

            const blacklistTimestamp = new Date(blacklistTime).getTime();
            return tokenIssuedAt < blacklistTimestamp;
        } catch (error) {
            logger.error('Failed to check user token blacklist', { userId, error });
            return false;
        }
    }

    getClient(): Redis {
        return this.client;
    }
}

export const redisClient = new RedisClient();
