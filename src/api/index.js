// server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { seeder } from './utils/seeder.js';
import transactionRoutes from './routes/transactionRoutes.js';
import rewardRoutes from './routes/rewardRoutes.js';
import logger from './utils/logger.js';
import { requestLogger } from './middleware/logging.js';
import { corsMiddleware } from './middleware/cors.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.set('io', io);

// Middleware
app.use(requestLogger);
app.use(corsMiddleware);

// Socket connection handling
io.on('connection', (socket) => {
  logger.info('A client connected:', { socketId: socket.id });

  socket.on('disconnect', () => {
    logger.info('Client disconnected:', { socketId: socket.id });
  });
});

// API routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/rewards', rewardRoutes);

// Health check
app.get('/health', (_, res) => {
  res.json({ message: 'Rewards API ready', endpoints: [
    '/api/transactions',
    '/api/rewards/total',
    '/api/rewards/monthly/1',
    '/api/rewards/top/1',
  ] });
});

seeder()
  .then(() => {
    server.listen(3000, () => {
      logger.info('Server running on http://localhost:3000');
      logger.info('API Endpoints available:', {
        endpoints: [
          'GET /api/rewards/total',
          'GET /api/rewards/monthly/',
          'GET /api/transactions',
          'GET /api/transactions/customer/:id',
          'POST /api/transactions/customer/:id',
        ],
      });
    });
  })
  .catch(err => {
    logger.error('Seeding failed:', { error: err.message, stack: err.stack });
    process.exit(1);
  });