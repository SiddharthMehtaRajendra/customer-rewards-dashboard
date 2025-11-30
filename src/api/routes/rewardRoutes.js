// routes/rewardRoutes.js
import express from 'express';
import { paginateQuery } from './utils.js';
import logger from '../utils/logger.js';

const router = express.Router();

// All customers – total rewards (ranked)
router.get('/total', async (req, res) => {
  try {
    const result = await paginateQuery(
      req,
      'SELECT COUNT(*) AS count FROM total_rewards',
      'SELECT * FROM total_rewards ORDER BY customerId ASC',
    );
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

    const result = await paginateQuery(
      req,
      'SELECT COUNT(*) AS count FROM monthly_rewards',
      `SELECT * FROM monthly_rewards ORDER BY ${order}`,
    );

    // Convert numeric month (1-12) to month name (e.g. 12 -> December)
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const convertRow = (row) => {
      // guard: allow month to be number or numeric-string
      const m = row.month;
      const n = Number(m);
      if (!Number.isNaN(n) && n >= 1 && n <= 12) {
        return { ...row, month: monthNames[n - 1] };
      }
      return row;
    };

    if (result && result.rows) {
      // paginated response
      result.rows = result.rows.map(convertRow);
      res.json(result);
    } else if (Array.isArray(result)) {
      // non-paginated response
      res.json(result.map(convertRow));
    } else {
      res.json(result);
    }
  } catch (err) {
    logger.error('Error fetching monthly rewards:', { error: err.message, stack: err.stack });
    res.status(500).json({ error: err.message });
  }
});

router.get('/top/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const rows = await paginateQuery(
      req,
      'SELECT COUNT(*) AS count FROM monthly_rewards WHERE customerId = ?',
      'SELECT year, month, points FROM monthly_rewards WHERE customerId = ? ORDER BY points DESC LIMIT 3',
      [id],
      3,
    );
    res.json(rows);
  } catch (err) {
    logger.error('Error fetching top rewards:', { customerId: req.params.id, error: err.message, stack: err.stack });
    res.status(500).json({ error: err.message });
  }
});

export default router;
