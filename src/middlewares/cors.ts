import cors from 'cors';

// CORS configuration
export const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

export const corsMiddleware = cors(corsOptions);
