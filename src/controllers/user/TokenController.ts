import { Request, Response, NextFunction } from 'express';
import { AuthenticationService } from '../../services/user/AuthenticationService';
import { BaseUserController } from './BaseUserController';
import { logger } from '../../utils/logger';
import { AppError } from '../../middlewares/errorHandler';

export class TokenController extends BaseUserController {
    private authService: AuthenticationService;

    constructor() {
        super();
        this.authService = new AuthenticationService();
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;
            
            if (!refreshToken) {
                throw new AppError('Refresh token is required', 400);
            }

            const result = await this.authService.refreshAccessToken(refreshToken, req);

            res.status(200).json({
                status: 'success',
                data: result
            });

        } catch (error) {
            logger.error('Refresh token error', {
                error: error instanceof Error ? error.message : 'Unknown error',
                ip: req.ip
            });
            next(error);
        }
    }

    async revokeToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;
            const userId = req.user?.id;

            if (!refreshToken) {
                throw new AppError('Refresh token is required', 400);
            }

            if (!userId) {
                throw new AppError('User not authenticated', 401);
            }

            await this.authService.revokeRefreshToken(userId, refreshToken);

            res.status(200).json({
                status: 'success',
                message: 'Token revoked successfully'
            });

        } catch (error) {
            logger.error('Revoke token error', {
                error: error instanceof Error ? error.message : 'Unknown error',
                userId: req.user?.id,
                ip: req.ip
            });
            next(error);
        }
    }

    async revokeAllTokens(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                throw new AppError('User not authenticated', 401);
            }

            await this.authService.revokeAllRefreshTokens(userId);

            res.status(200).json({
                status: 'success',
                message: 'All tokens revoked successfully'
            });

        } catch (error) {
            logger.error('Revoke all tokens error', {
                error: error instanceof Error ? error.message : 'Unknown error',
                userId: req.user?.id,
                ip: req.ip
            });
            next(error);
        }
    }

    async getActiveTokens(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                throw new AppError('User not authenticated', 401);
            }

            const user = await this.authService.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const activeTokens = user.refreshTokens
                .filter(token => token.isActive && token.expiresAt > new Date())
                .map(token => ({
                    deviceFingerprint: token.deviceFingerprint,
                    createdAt: token.createdAt,
                    expiresAt: token.expiresAt
                }));

            res.status(200).json({
                status: 'success',
                data: {
                    activeTokens: activeTokens.length,
                    tokens: activeTokens
                }
            });

        } catch (error) {
            logger.error('Get active tokens error', {
                error: error instanceof Error ? error.message : 'Unknown error',
                userId: req.user?.id
            });
            next(error);
        }
    }
}
