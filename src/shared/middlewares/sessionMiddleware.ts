import session from 'express-session';
import MongoStore from 'connect-mongo';
import { config } from '../config';
import { logger } from '../utils/logger';

// Extend session interface
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    userEmail?: string;
    userRole?: string;
    deviceFingerprint?: string;
    loginTime?: Date;
    lastActivity?: Date;
    isSecure?: boolean;
  }
}

export const sessionConfig = session({
  name: 'sessionId', // Don't use default session name
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: config.MONGO_URI,
    touchAfter: 24 * 3600, // Lazy session update
    stringify: false,
    ttl: 24 * 60 * 60 // Session TTL in seconds (24 hours)
  }),
  cookie: {
    secure: config.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' // CSRF protection
  }
});

// Session regeneration helper
export const regenerateSession = (req: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err: any) => {
      if (err) {
        logger.error('Session regeneration failed', { error: err.message });
        reject(err);
      } else {
        logger.info('Session regenerated successfully');
        resolve();
      }
    });
  });
};

// Session destruction helper
export const destroySession = (req: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err: any) => {
      if (err) {
        logger.error('Session destruction failed', { error: err.message });
        reject(err);
      } else {
        logger.info('Session destroyed successfully');
        resolve();
      }
    });
  });
};
