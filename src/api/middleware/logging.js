import logger from '../utils/logger.js';

/**
 * Request/Response logging middleware
 * Logs incoming requests and outgoing responses with metadata
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log incoming request
  logger.info('Incoming request:', {
    method: req.method,
    url: req.url,
    path: req.path,
    query: req.query,
    body: req.body,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Capture original end function
  const originalEnd = res.end;
  
  // Override res.end to log response
  res.end = function (chunk, encoding) {
    res.end = originalEnd;
    res.end(chunk, encoding);
    
    const duration = Date.now() - startTime;
    logger.info('Response sent:', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  };
  
  next();
};
