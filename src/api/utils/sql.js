const REWARDS_EXPRESSION = `
  CAST(
    CASE
      WHEN price <= 50  THEN 0
      WHEN price <= 100 THEN (price - 50)
      ELSE 50 + 2 * (price - 100)
    END AS INTEGER
  )
`;

export const CREATE_TRANSACTIONS = `
  CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId INTEGER NOT NULL,
    transactionId TEXT UNIQUE,
    customerName TEXT,
    purchaseDate TEXT,
    product TEXT,
    price REAL NOT NULL,
    rewardsPoints INTEGER GENERATED ALWAYS AS (
      CASE
        WHEN price <= 50 THEN 0
        WHEN price <= 100 THEN CAST(price - 50 AS INTEGER)
        ELSE 50 + 2 * CAST(price - 100 AS INTEGER)
      END
    ) VIRTUAL
  );
`;

export const CREATE_MONTHLY_REWARDS = `
    CREATE TABLE monthly_rewards (
      customerId INTEGER,
      customerName TEXT,
      year INTEGER,
      month INTEGER,
      points INTEGER,
      PRIMARY KEY (customerId, year, month)
    )
  `;

export const CREATE_TOTAL_REWARDS = `
    CREATE TABLE total_rewards (
      customerId INTEGER PRIMARY KEY,
      customerName TEXT,
      totalPoints INTEGER
    )
  `;

export const INSERT_MONTHLY = `
    INSERT INTO monthly_rewards
    SELECT customerId, customerName,
           CAST(substr(purchaseDate,7,4) AS INTEGER) AS year,
           CAST(substr(purchaseDate,4,2) AS INTEGER) AS month,
           SUM(${REWARDS_EXPRESSION}) AS points
    FROM transactions
    GROUP BY customerId, year, month
  `;

export const INSERT_TOTAL = `
    INSERT INTO total_rewards
    SELECT customerId, customerName,
           SUM(${REWARDS_EXPRESSION}) AS totalPoints
    FROM transactions
    GROUP BY customerId, customerName
    ORDER BY totalPoints DESC
  `;
