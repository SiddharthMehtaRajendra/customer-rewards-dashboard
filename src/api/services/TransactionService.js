import DatabaseService from './DatabaseService.js';
import LoggerService from './LoggerService.js';
import SocketService from './SocketService.js';
import {
  randomPrice,
  randomDate,
  randomTxnId,
  TXNS_PER_CUSTOMER,
} from '../utils/randomizer.js';
import { products } from '../utils/products.js';
import { Random } from 'random-js';
const random = new Random();

const PRODUCT_CATALOG = new Map();
products.forEach(productName => {
  PRODUCT_CATALOG.set(productName, randomPrice());
});

class TransactionService {
  static async insertTransactions(transactions) {
    return new Promise((resolve, reject) => {
      const stmt = DatabaseService.prepare(`
        INSERT INTO transactions
        (customerId, transactionId, customerName, purchaseDate, product, price)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const txn of transactions) {
        stmt.run(
          txn.customerId,
          txn.transactionId,
          txn.customerName,
          txn.purchaseDate,
          txn.product,
          txn.price,
        );
      }

      stmt.finalize((err) => {
        if (err) return reject(err);
        LoggerService.debug('Transactions inserted', { count: transactions.length });
        resolve();
      });
    });
  }

  static async getTransactions(page, pageSize, orderBy = 'purchaseDate DESC', customerNameFilter = null) {
    let countSql = 'SELECT COUNT(*) AS count FROM transactions';
    let dataSql = 'SELECT * FROM transactions';
    const params = [];

    if (customerNameFilter) {
      const searchTerm = `%${customerNameFilter}%`;
      countSql += ' WHERE customerName LIKE ?';
      dataSql += ' WHERE customerName LIKE ?';
      params.push(searchTerm);
    }

    dataSql += ` ORDER BY ${orderBy}`;

    if (page && pageSize) {
      const countRows = await DatabaseService.all(countSql, params);
      const total = countRows[0]?.count || 0;
      const offset = (page - 1) * pageSize;
      const rows = await DatabaseService.all(dataSql + ' LIMIT ? OFFSET ?', [...params, pageSize, offset]);
      return { rows, total, page, pageSize };
    } else {
      const limit = pageSize || 5000;
      const rows = await DatabaseService.all(dataSql + ' LIMIT ?', [...params, limit]);
      return rows;
    }
  }

  static async getTransactionsByCustomer(customerId, page, pageSize, customerNameFilter = null) {
    let countSql = 'SELECT COUNT(*) AS count FROM transactions WHERE customerId = ?';
    let dataSql = 'SELECT * FROM transactions WHERE customerId = ? ORDER BY purchaseDate DESC';
    const params = [customerId];

    if (customerNameFilter) {
      const searchTerm = `%${customerNameFilter}%`;
      countSql += ' AND customerName LIKE ?';
      dataSql += ' AND customerName LIKE ?';
      params.push(searchTerm);
    }

    if (page && pageSize) {
      const countRows = await DatabaseService.all(countSql, params);
      const total = countRows[0]?.count || 0;
      const offset = (page - 1) * pageSize;
      const rows = await DatabaseService.all(dataSql + ' LIMIT ? OFFSET ?', [...params, pageSize, offset]);
      return { rows, total, page, pageSize };
    } else {
      const limit = pageSize || 100;
      const rows = await DatabaseService.all(dataSql + ' LIMIT ?', [...params, limit]);
      return rows;
    }
  }

  static createTransaction(transactionData) {
    const { customerId, transactionId, customerName, purchaseDate, product, price } = transactionData;
    const insertSql = `
      INSERT INTO transactions
      (customerId, transactionId, customerName, purchaseDate, product, price)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    return DatabaseService.run(insertSql, [
      customerId,
      transactionId,
      customerName,
      purchaseDate,
      product,
      price,
    ]);
  }

  static emitCustomerAdded(data) {
    const io = SocketService.getIO();
    if (io) {
      io.emit('customer-added', {
        message: 'New customer(s) added!',
        timestamp: new Date(),
        ...data,
      });
      LoggerService.debug('customer-added event emitted', data);
    }
  }

  static async getNextCustomerId() {
    const result = await DatabaseService.all('SELECT MAX(customerId) as maxId FROM transactions');
    const maxId = result[0]?.maxId || 0;
    return maxId + 1;
  }

  static generateTransactions(customers) {
    const transactions = [];
    const usedTransactionIds = new Set();
    
    for (const customer of customers) {
      for (let transactionIndex = 0; transactionIndex < TXNS_PER_CUSTOMER; transactionIndex++) {
        let transactionId;
        do {
          transactionId = randomTxnId();
        } while (usedTransactionIds.has(transactionId));
        usedTransactionIds.add(transactionId);
        
        const product = random.pick(products);
        const price = PRODUCT_CATALOG.get(product);
        
        transactions.push({
          customerId: customer.id,
          transactionId,
          customerName: customer.name,
          purchaseDate: randomDate(),
          product,
          price,
        });
      }
    }
    return transactions;
  }
}

export default TransactionService;
