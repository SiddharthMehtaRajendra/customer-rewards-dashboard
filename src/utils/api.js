import JSONDataService from '../services/JSONDataService.js';
import TransactionService from '../services/TransactionService.js';
import RewardsService from '../services/RewardsService.js';
import { TRANSACTIONS_DATA_JSON_PATH } from './constants.js';
/**
 * API Layer Module
 * 
 * This is the API layer for the UI. It uses local service files to handle
 * data operations instead of making HTTP requests to a backend server.
 * 
 * The services use JSONDataService to load data from the public folder
 * and implement business logic client-side. This architecture allows the
 * application to run entirely in the browser without a Node.js backend.
 */

// Initialize JSONDataService with the public folder path
JSONDataService.initialize(TRANSACTIONS_DATA_JSON_PATH);

/**
 * Fetches paginated and filtered transaction data
 * 
 * This function retrieves transactions with support for:
 * - Pagination (page and pageSize)
 * - Filtering by customer name
 */
export const fetchTransactions = async (params) => {
  const { page, pageSize, customerNameFilter, customerName } = params || {};
  const orderBy = 'purchaseDate DESC';
  const nameFilter = customerName || customerNameFilter;
  const result = await TransactionService.getTransactions(page, pageSize, orderBy, nameFilter);
  return result;
};

/**
 * Fetches total reward points aggregated by customer
 * 
 * Calculates and returns the total reward points earned by each customer across
 * all their transactions. Points are summed up for each unique customer by the customerId.
 * Returns: { data: [{ customerId: 1, customerName: 'John Smith', totalPoints: 450 }], total: 1, page: 1, pageSize: 10 }
 */
export const fetchRewardsTotal = async (params) => {
  const { page, pageSize, customerNameFilter, customerName } = params || {};
  const nameFilter = customerName || customerNameFilter;
  return RewardsService.getTotalRewards(page, pageSize, nameFilter);
};

/**
 * Fetches reward points aggregated by customer and month
 * 
 * Calculates reward points earned by each customer by month and year.
 */
export const fetchRewardsMonthly = async (params) => {
  const { page, pageSize, order, customerNameFilter, customerName } = params || {};
  const nameFilter = customerName || customerNameFilter;
  return RewardsService.getMonthlyRewards(page, pageSize, order, nameFilter);
};
