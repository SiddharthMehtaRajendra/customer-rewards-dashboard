// routes/rewardRoutes.js
import express from 'express';
import LoggerService from '../services/LoggerService.js';
import DatabaseService from '../services/DatabaseService.js';
import { getPaginationParams } from './utils.js';

const router = express.Router();

// All customers – total rewards (ranked)
router.get('/total', async (req, res) => {
  try {
    const { page, pageSize } = getPaginationParams(req);
    const result = await DatabaseService.getTotalRewards(page, pageSize, req.query.customerName);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/monthly/', async (req, res) => {
  try {
    const sort = req.query.sort || 'desc';
    const order =
      sort.toLowerCase() === 'asc'
        ? 'year ASC, month ASC'
        : 'year DESC, month DESC';
    const { page, pageSize } = getPaginationParams(req);
    const result = await DatabaseService.getMonthlyRewards(page, pageSize, order, req.query.customerName);
    res.json(result);
  } catch (err) {
    LoggerService.error('Error fetching monthly rewards:', { error: err.message, stack: err.stack });
    res.status(500).json({ error: err.message });
  }
});

router.get('/top/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const rows = await DatabaseService.getTopRewardsByCustomer(id, 3);
    res.json(rows);
  } catch (err) {
    LoggerService.error('Error fetching top rewards:', { customerId: req.params.id, error: err.message, stack: err.stack });
    res.status(500).json({ error: err.message });
  }
});

export default router;
