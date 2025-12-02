import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, '../../logs');

class LoggerService {
  static #logger = null;

  static #getLogger() {
    if (!LoggerService.#logger) {
      LoggerService.#logger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.errors({ stack: true }),
          winston.format.splat(),
          winston.format.json(),
        ),
        defaultMeta: { service: 'api-service' },
        transports: [
          new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5,
          }),
          new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            maxsize: 5242880,
            maxFiles: 5,
          }),
        ],
      });
    }
    return LoggerService.#logger;
  }

  static info(message, meta) {
    LoggerService.#getLogger().info(message, meta);
  }

  static error(message, meta) {
    LoggerService.#getLogger().error(message, meta);
  }

  static warn(message, meta) {
    LoggerService.#getLogger().warn(message, meta);
  }

  static debug(message, meta) {
    LoggerService.#getLogger().debug(message, meta);
  }

  static verbose(message, meta) {
    LoggerService.#getLogger().verbose(message, meta);
  }

  static log(level, message, meta) {
    LoggerService.#getLogger().log(level, message, meta);
  }
}

export default LoggerService;
