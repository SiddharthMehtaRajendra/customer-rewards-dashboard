import LoggerService from '../services/LoggerService.js';

export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  LoggerService.info('Incoming request:', {
    method: req.method,
    url: req.url,
    path: req.path,
    query: req.query,
    body: req.body,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  const originalEnd = res.end;
  
  res.end = function (chunk, encoding) {
    res.end = originalEnd;
    res.end(chunk, encoding);
    
    const duration = Date.now() - startTime;
    LoggerService.info('Response sent:', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  };
  
  next();
};
