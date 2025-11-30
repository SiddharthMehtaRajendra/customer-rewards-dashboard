// seed.js - Main data seeder

import db from './db.js';
import { Random } from 'random-js';
import { generateProductName } from './products.js';
import logger from './logger.js';
import {
  randomDate,
  randomPrice,
  randomTxnId,
  CUSTOMERS,
  TXNS_PER_CUSTOMER,
  firstNames,
  lastNames,
} from './randomizer.js';
import {
  CREATE_TRANSACTIONS,
  CREATE_MONTHLY_REWARDS,
  CREATE_TOTAL_REWARDS,
  INSERT_MONTHLY,
  INSERT_TOTAL,
} from './sql.js';

const random = new Random();

const dbInsertTransaction = (resolve, reject) => {
  const customers = [];
  for (let i = 1; i <= CUSTOMERS; i++) {
    customers.push({
      id: i,
      name: `${random.pick(firstNames)} ${random.pick(lastNames)}`,
    });
  }

  const stmt = db.prepare(`
        INSERT INTO transactions
        (customerId, transactionId, customerName, purchaseDate, product, price)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

  for (const customer of customers) {
    for (let i = 0; i < TXNS_PER_CUSTOMER; i++) {
      stmt.run(
        customer.id,
        randomTxnId(),
        customer.name,
        randomDate(),
        generateProductName(),
        randomPrice(),
      );
    }
  }

  stmt.finalize((err) => {
    if (err) return reject(err);
    db.run(INSERT_MONTHLY, (err) => {
      if (err) return reject(err);
      db.run(INSERT_TOTAL, (err) => {
        if (err) return reject(err);
        logger.info('Seeding complete!');
        resolve();
      });
    });
  });
};

export const seeder = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('DROP TABLE IF EXISTS transactions');
      db.run('DROP TABLE IF EXISTS monthly_rewards');
      db.run('DROP TABLE IF EXISTS total_rewards');

      db.run(CREATE_TRANSACTIONS);
      db.run(CREATE_MONTHLY_REWARDS);
      db.run(CREATE_TOTAL_REWARDS);

      dbInsertTransaction(resolve, reject);
    });
  });
};
