import morgan from 'morgan';
import { config } from '../config';
import { requestLoggerStream } from './logger';

// Define custom tokens for colored output
morgan.token('colored-method', (req) => {
  const method = req.method || 'UNKNOWN';
  const colors: { [key: string]: string } = {
    'GET': '\x1b[32m',    // Green
    'POST': '\x1b[33m',   // Yellow
    'PUT': '\x1b[34m',    // Blue
    'DELETE': '\x1b[31m', // Red
    'PATCH': '\x1b[35m'   // Magenta
  };
  const color = colors[method] || '\x1b[37m';
  return `${color}${method}\x1b[0m`;
});

morgan.token('colored-status', (req, res) => {
  const status = res.statusCode;
  let color = '\x1b[0m'; // Default
  if (status >= 500) color = '\x1b[31m'; // Red
  else if (status >= 400) color = '\x1b[33m'; // Yellow
  else if (status >= 300) color = '\x1b[36m'; // Cyan
  else if (status >= 200) color = '\x1b[32m'; // Green
  return `${color}${status}\x1b[0m`;
});

// Custom format for HTTP requests
const customFormat = '🌐 :colored-method :url :colored-status :res[content-length] - :response-time ms - :remote-addr';

// Export configured morgan middleware
export const morganMiddleware = morgan(customFormat, { 
  stream: config.NODE_ENV === 'production' ? requestLoggerStream : process.stdout
});
