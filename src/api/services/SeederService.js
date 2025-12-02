import { Random } from 'random-js';
import LoggerService from './LoggerService.js';
import DatabaseService from './DatabaseService.js';
import TransactionService from './TransactionService.js';
import CSVService from './CSVService.js';
import { CREATE_TRANSACTIONS, CREATE_MONTHLY_REWARDS, CREATE_TOTAL_REWARDS } from '../utils/sql.js';
import {
  CUSTOMERS,
  firstNames,
  lastNames,
} from '../utils/randomizer.js';

const random = new Random();

class SeederService {
  static generateCustomers() {
    const customers = [];
    const names = new Set();
    while(names.size < CUSTOMERS) {
      const name = `${random.pick(firstNames)} ${random.pick(lastNames)}`;
      if (!names.has(name)) {
        names.add(name);
      }
    }
    const namesArray = Array.from(names);
    for (let customerIndex = 1; customerIndex <= CUSTOMERS; customerIndex++) {
      customers.push({
        id: customerIndex,
        name: namesArray[customerIndex - 1],
      });
    }
    return customers;
  }

  static generateTransactionsData() {
    const customers = SeederService.generateCustomers();
    const transactions = TransactionService.generateTransactions(customers);
    return transactions;
  }

  static async dropTables() {
    await DatabaseService.run('DROP TABLE IF EXISTS transactions');
    await DatabaseService.run('DROP TABLE IF EXISTS monthly_rewards');
    await DatabaseService.run('DROP TABLE IF EXISTS total_rewards');
    LoggerService.debug('All tables dropped');
  }

  static async createTables() {
    await DatabaseService.run(CREATE_TRANSACTIONS);
    await DatabaseService.run(CREATE_MONTHLY_REWARDS);
    await DatabaseService.run(CREATE_TOTAL_REWARDS);
    LoggerService.debug('All tables created');
  }

  static async seed() {
    try {
      LoggerService.info('Starting database seeding...');
      
      const transactions = SeederService.generateTransactionsData();
      
      await DatabaseService.initializeDatabase(transactions);
      
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
