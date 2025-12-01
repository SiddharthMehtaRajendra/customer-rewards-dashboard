import LoggerService from './LoggerService.js';
import TransactionService from './TransactionService.js';
import RewardsService from './RewardsService.js';
import sqlite3 from 'sqlite3';
import SeederService from './SeederService.js';

const sqlite3Client = sqlite3.verbose();
const db = new sqlite3Client.Database(':memory:');

class DatabaseService {
  static run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      });
    });
  }

  static all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static prepare(sql) {
    return db.prepare(sql);
  }

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

  static initializeDatabase(transactionsData) {
    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        try {
          await SeederService.dropTables();
          await SeederService.createTables();
          await TransactionService.insertTransactions(transactionsData);
          await RewardsService.populateMonthlyRewards();
          await RewardsService.populateTotalRewards();
          LoggerService.info('Database initialized successfully');
          resolve();
        } catch (err) {
          LoggerService.error('Database initialization failed', { error: err.message, stack: err.stack });
          reject(err);
        }
      });
    });
  }
}

export default DatabaseService;
