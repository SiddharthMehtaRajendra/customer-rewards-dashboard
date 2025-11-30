// routes/rewardRoutes.js
import express from 'express';
import { paginateQuery, dbRun } from './utils.js';
import { randomDate, randomPrice, randomTxnId } from '../utils/randomizer.js';
import { generateProductName } from '../utils/products.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get recent transactions (sample) - supports pagination via `page` & `pageSize`
router.get('/', async (req, res) => {
  try {
    
    // Build ORDER BY clause based on sortBy and sortOrder
    let orderBy = 'purchaseDate DESC';
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';
      orderBy = `${sortField} ${sortOrder}`;
    }
    
    const result = await paginateQuery(
      req,
      'SELECT COUNT(*) AS count FROM transactions',
      `SELECT * FROM transactions ORDER BY ${orderBy}`,
    );
    res.json(result);
  } catch (err) {
    logger.error('Error fetching transactions:', { error: err.message, stack: err.stack });
    res.status(500).json({ error: err.message });
  }
});

// Get transactions by customer
router.get('/customer/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await paginateQuery(
      req,
      'SELECT COUNT(*) AS count FROM transactions WHERE customerId = ?',
      'SELECT * FROM transactions WHERE customerId = ? ORDER BY purchaseDate DESC',
      [id],
      100,
    );
    res.json(result);
  } catch (err) {
    logger.error('Error fetching customer transactions:', { customerId: req.params.id, error: err.message, stack: err.stack });
    res.status(500).json({ error: err.message });
  }
});

router.post('/customer/:id', async (req, res) => {
  const customerId = req.params.id;
  const body = req.body || {};
  const { customerName, txnId, date, productName, price } = body;

  const insertSql = `
          INSERT INTO transactions
          (customerId, transactionId, customerName, purchaseDate, product, price)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

  try {
    const lastID = await dbRun(insertSql, [
      customerId,
      txnId || randomTxnId(),
      customerName,
      date || randomDate(),
      productName || generateProductName(),
      price || randomPrice(),
    ]);

    logger.info('Transaction created:', { customerId, transactionId: lastID });

    // Access io from req.app
    const io = req.app.get('io');
    // Emit to all connected clients
    if (io) {
      io.emit('customer-added', {
        message: 'New customer(s) added!',
        timestamp: new Date(),
        id: lastID,
      });
    }

    return res.status(201).json({ success: true, id: lastID });
  } catch (err) {
    logger.error('Error creating transaction:', { customerId, error: err.message, stack: err.stack });
    return res.status(500).json({ error: err.message });
  }
});

export default router;
