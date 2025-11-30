// DatabaseService for handling all database operations
import LoggerService from './LoggerService.js';
import {
  CREATE_TRANSACTIONS,
  CREATE_MONTHLY_REWARDS,
  CREATE_TOTAL_REWARDS,
  INSERT_MONTHLY,
  INSERT_TOTAL,
} from '../utils/sql.js';

import sqlite3 from 'sqlite3';

const sqlite3Client = sqlite3.verbose();
const db = new sqlite3Client.Database(':memory:');

class DatabaseService {
  // Execute a raw SQL query
  static run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      });
    });
  }

  // Fetch all rows matching a query
  static all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  // Prepare a statement for batch inserts
  static prepare(sql) {
    return db.prepare(sql);
  }

  // Serialize database operations
  static serialize(callback) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        try {
          callback();
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  // Drop all tables
  static async dropTables() {
    await DatabaseService.run('DROP TABLE IF EXISTS transactions');
    await DatabaseService.run('DROP TABLE IF EXISTS monthly_rewards');
    await DatabaseService.run('DROP TABLE IF EXISTS total_rewards');
    LoggerService.debug('All tables dropped');
  }

  // Create all tables
  static async createTables() {
    await DatabaseService.run(CREATE_TRANSACTIONS);
    await DatabaseService.run(CREATE_MONTHLY_REWARDS);
    await DatabaseService.run(CREATE_TOTAL_REWARDS);
    LoggerService.debug('All tables created');
  }

  // Insert transaction records in batch
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

  // Populate monthly rewards from transactions
  static async populateMonthlyRewards() {
    await DatabaseService.run(INSERT_MONTHLY);
    LoggerService.debug('Monthly rewards populated');
  }

  // Populate total rewards from transactions
  static async populateTotalRewards() {
    await DatabaseService.run(INSERT_TOTAL);
    LoggerService.debug('Total rewards populated');
  }

  // Initialize database (drop, create, and seed)
  static async initializeDatabase(transactionsData) {
    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        try {
          await DatabaseService.dropTables();
          await DatabaseService.createTables();
          await DatabaseService.insertTransactions(transactionsData);
          await DatabaseService.populateMonthlyRewards();
          await DatabaseService.populateTotalRewards();
          LoggerService.info('Database initialized successfully');
          resolve();
        } catch (err) {
          LoggerService.error('Database initialization failed', { error: err.message, stack: err.stack });
          reject(err);
        }
      });
    });
  }

  // Get all transactions with pagination and sorting
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

    // Add ORDER BY clause
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

  // Get transactions by customer ID
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

  // Create a new transaction
  static async createTransaction(transactionData) {
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

  // Get total rewards with pagination
  static async getTotalRewards(page, pageSize, customerNameFilter = null) {
    let countSql = 'SELECT COUNT(*) AS count FROM total_rewards';
    let dataSql = 'SELECT * FROM total_rewards ORDER BY customerId ASC';
    const params = [];

    if (customerNameFilter) {
      const searchTerm = `%${customerNameFilter}%`;
      countSql += ' WHERE customerName LIKE ?';
      dataSql = dataSql.replace(/ORDER BY/, 'WHERE customerName LIKE ? ORDER BY');
      params.push(searchTerm);
    }

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

  // Get monthly rewards with pagination and sorting
  static async getMonthlyRewards(page, pageSize, order = 'year DESC, month DESC', customerNameFilter = null) {
    let countSql = 'SELECT COUNT(*) AS count FROM monthly_rewards';
    let dataSql = `SELECT * FROM monthly_rewards ORDER BY ${order}`;
    const params = [];

    if (customerNameFilter) {
      const searchTerm = `%${customerNameFilter}%`;
      countSql += ' WHERE customerName LIKE ?';
      dataSql = dataSql.replace(/ORDER BY/, 'WHERE customerName LIKE ? ORDER BY');
      params.push(searchTerm);
    }

    // Month name conversion helper
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const convertRow = (row) => {
      const m = row.month;
      const n = Number(m);
      if (!Number.isNaN(n) && n >= 1 && n <= 12) {
        return { ...row, month: monthNames[n - 1] };
      }
      return row;
    };

    if (page && pageSize) {
      const countRows = await DatabaseService.all(countSql, params);
      const total = countRows[0]?.count || 0;
      const offset = (page - 1) * pageSize;
      const rows = await DatabaseService.all(dataSql + ' LIMIT ? OFFSET ?', [...params, pageSize, offset]);
      return { rows: rows.map(convertRow), total, page, pageSize };
    } else {
      const limit = pageSize || 5000;
      const rows = await DatabaseService.all(dataSql + ' LIMIT ?', [...params, limit]);
      return rows.map(convertRow);
    }
  }

  // Get top rewards for a customer
  static async getTopRewardsByCustomer(customerId, limit = 3) {
    const countSql = 'SELECT COUNT(*) AS count FROM monthly_rewards WHERE customerId = ?';
    const dataSql = 'SELECT year, month, points FROM monthly_rewards WHERE customerId = ? ORDER BY points DESC LIMIT ?';
    const countRows = await DatabaseService.all(countSql, [customerId]);
    const rows = await DatabaseService.all(dataSql, [customerId, limit]);
    return { count: countRows[0]?.count || 0, rows };
  }

  // Get the next available customer ID
  static async getNextCustomerId() {
    const result = await DatabaseService.all('SELECT MAX(customerId) as maxId FROM transactions');
    const maxId = result[0]?.maxId || 0;
    return maxId + 1;
  }

  // Update rewards tables after new transaction
  static async updateRewardsTables() {
    // Clear existing rewards
    await DatabaseService.run('DELETE FROM monthly_rewards');
    await DatabaseService.run('DELETE FROM total_rewards');
    
    // Repopulate rewards
    await DatabaseService.populateMonthlyRewards();
    await DatabaseService.populateTotalRewards();
    
    LoggerService.debug('Rewards tables updated');
  }
}

export default DatabaseService;
