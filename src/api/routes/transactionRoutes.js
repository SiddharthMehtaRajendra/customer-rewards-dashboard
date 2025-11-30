// routes/transactionRoutes.js
import express from 'express';
import { randomDate, randomPrice, randomTxnId } from '../utils/randomizer.js';
import { generateProductName } from '../utils/products.js';
import LoggerService from '../services/LoggerService.js';
import DatabaseService from '../services/DatabaseService.js';
import SocketService from '../services/SocketService.js';
import { getPaginationParams } from './utils.js';

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
    const { page, pageSize } = getPaginationParams(req);
    const result = await DatabaseService.getTransactions(page, pageSize, orderBy, req.query.customerName);
    res.json(result);
  } catch (err) {
    LoggerService.error('Error fetching transactions:', { error: err.message, stack: err.stack });
    res.status(500).json({ error: err.message });
  }
});

// Get transactions by customer
router.get('/customer/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { page, pageSize } = getPaginationParams(req);
    const result = await DatabaseService.getTransactionsByCustomer(id, page, pageSize, req.query.customerName);
    res.json(result);
  } catch (err) {
    LoggerService.error('Error fetching customer transactions:', { customerId: req.params.id, error: err.message, stack: err.stack });
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const body = req.body || {};
  const { customerName, txnId, date, productName, price } = body;
  try {
    const customerId = await DatabaseService.getNextCustomerId();
    const lastID = await DatabaseService.createTransaction({
      customerId,
      transactionId: txnId || randomTxnId(),
      customerName,
      purchaseDate: date || randomDate(),
      product: productName || generateProductName(),
      price: price || randomPrice(),
    });
    
    // Update monthly and total rewards tables
    await DatabaseService.updateRewardsTables();
    
    LoggerService.info('Transaction created:', { customerId, transactionId: lastID });
    
    // Emit socket event for new customer
    SocketService.emitCustomerAdded({ id: lastID, customerId });

    return res.status(201).json({ success: true, id: lastID, customerId });
  } catch (err) {
    LoggerService.error('Error creating transaction:', { error: err.message, stack: err.stack });
    return res.status(500).json({ error: err.message });
  }
});

export default router;
