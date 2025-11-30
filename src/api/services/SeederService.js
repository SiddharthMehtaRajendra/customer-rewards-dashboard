// SeederService - Main data seeding service

import { Random } from 'random-js';
import { generateProductName } from '../utils/products.js';
import LoggerService from './LoggerService.js';
import DatabaseService from './DatabaseService.js';
import CSVService from './CSVService.js';
import {
  randomDate,
  randomPrice,
  randomTxnId,
  CUSTOMERS,
  TXNS_PER_CUSTOMER,
  firstNames,
  lastNames,
} from '../utils/randomizer.js';

const random = new Random();

class SeederService {
  /**
   * Generate random customer data
   * @returns {Array} Array of customer objects
   */
  static generateCustomers() {
    const customers = [];
    for (let i = 1; i <= CUSTOMERS; i++) {
      customers.push({
        id: i,
        name: `${random.pick(firstNames)} ${random.pick(lastNames)}`,
      });
    }
    return customers;
  }

  /**
   * Generate random transaction data for customers
   * @param {Array} customers - Array of customer objects
   * @returns {Array} Array of transaction objects
   */
  static generateTransactions(customers) {
    const transactions = [];
    for (const customer of customers) {
      for (let i = 0; i < TXNS_PER_CUSTOMER; i++) {
        transactions.push({
          customerId: customer.id,
          transactionId: randomTxnId(),
          customerName: customer.name,
          purchaseDate: randomDate(),
          product: generateProductName(),
          price: randomPrice(),
        });
      }
    }
    return transactions;
  }

  /**
   * Generate all transaction data
   * @returns {Array} Array of transaction objects
   */
  static generateTransactionsData() {
    const customers = SeederService.generateCustomers();
    const transactions = SeederService.generateTransactions(customers);
    return transactions;
  }

  /**
   * Seed the database with initial data
   * @returns {Promise<void>}
   */
  static async seed() {
    try {
      LoggerService.info('Starting database seeding...');
      
      const transactions = SeederService.generateTransactionsData();
      
      // Initialize database with transactions
      await DatabaseService.initializeDatabase(transactions);
      
      // Write transactions to CSV file
      CSVService.writeTransactions(transactions);
      
      LoggerService.info('Seeding complete!', { 
        transactionsCount: transactions.length,
        customersCount: CUSTOMERS,
      });
    } catch (err) {
      LoggerService.error('Seeding failed', { error: err.message, stack: err.stack });
      throw err;
    }
  }
}

export default SeederService;
