// server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import transactionRoutes from './routes/transactionRoutes.js';
import rewardRoutes from './routes/rewardRoutes.js';
import LoggerService from './services/LoggerService.js';
import SocketService from './services/SocketService.js';
import { requestLogger } from './middleware/logging.js';
import { corsMiddleware } from './middleware/cors.js';
import SeederService from './services/SeederService.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Initialize SocketService with io instance
SocketService.initialize(io);

app.use(express.json());
// Middleware
app.use(requestLogger);
app.use(corsMiddleware);

app.set('io', io);

// Socket connection handling
io.on('connection', (socket) => {
  LoggerService.info('A client connected:', { socketId: socket.id });

  socket.on('disconnect', () => {
    LoggerService.info('Client disconnected:', { socketId: socket.id });
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

SeederService.seed()
  .then(() => {
    server.listen(3000, () => {
      LoggerService.info('Server running on http://localhost:3000');
      LoggerService.info('API Endpoints available:', {
        endpoints: [
          'GET /api/rewards/total',
          'GET /api/rewards/monthly/',
          'GET /api/transactions',
          'GET /api/transactions/customer/:id',
          'POST /api/transactions',
        ],
      });
    });
  })
  .catch(err => {
    LoggerService.error('Seeding failed:', { error: err.message, stack: err.stack });
    process.exit(1);
  });