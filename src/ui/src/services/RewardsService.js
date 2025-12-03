import JSONDataService from './JSONDataService.js';

/* eslint-disable */
/**
 * RewardsService - Customer Rewards Calculation Service
 * 
 * This service handles all reward points calculation and aggregation logic.
 * It processes transaction data to compute:
 * - Total reward points per customer
 * - Monthly reward points breakdown by customer
 * 
 * Business Logic:
 * Rewards are already calculated in each transaction based on purchase amount:
 * - $0 - $50: 0 points
 * - $51 - $100: 1 point per dollar over $50
 * - Over $100: 2 points per dollar over $100, plus 50 points for dollars 51-100
 * 
 * This service aggregates those pre-calculated points by customer and time period.
 */
class RewardsService {
  /**
   * Parses a date string in DD-MM-YYYY format into component parts
   */
  static parseDate(stringFormattedDate) {
    const dateParts = stringFormattedDate?.split('-');
    return {
      day: parseInt(dateParts[0]),
      month: parseInt(dateParts[1]),
      year: parseInt(dateParts[2]),
    };
  }

  /**
   * Calculates total reward points for each customer across all transactions
   * 
   * This method:
   * 1. Loads all transactions from the data source
   * 2. Groups transactions by customer ID
   * 3. Sums up reward points for each customer
   * 4. Applies optional customer name filtering
   * 5. Returns paginated results sorted by customer ID
   * 
   * Algorithm:
   * - Uses a Map to efficiently group and aggregate points by customer
   * - Each transaction's pre-calculated points are summed per customer
   * - Results are sorted by customerId in ascending order
   */
  static async getTotalRewards(page, pageSize, customerNameFilter = null) {
    const transactions = await JSONDataService.loadTransactions();

    if (!transactions || transactions.length === 0) {
      return { data: [], total: 0, page, pageSize };
    }
    
    const customerMap = new Map();
    
    transactions.forEach(transaction => {
      const customerId = parseInt(transaction?.customerId);
      const customerName = transaction?.customerName;
      const points = transaction?.points || 0;
      
      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          customerId,
          customerName,
          totalPoints: 0
        });
      }
      
      customerMap.get(customerId).totalPoints += points;
    });
    
    let customerRewards = Array.from(customerMap.values());
    
    // Apply customer name filter
    if (customerNameFilter?.trim()) {
      const searchTerm = customerNameFilter.toLowerCase().trim();
      customerRewards = customerRewards?.filter(reward => reward?.customerName?.toLowerCase().includes(searchTerm));
    }
    
    // Sort by customerId
    customerRewards.sort((a, b) => a.customerId - b.customerId);
    
    const total = customerRewards.length;
    
    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      const paginatedRewards = customerRewards.slice(offset, offset + pageSize);
      return { data: paginatedRewards, total, page, pageSize };
    } else {
      const limit = pageSize || 5000;
      const limitedRewards = customerRewards.slice(0, limit);
      return limitedRewards;
    }
  }

  /**
   * Calculates reward points for each customer grouped by month and year
   * 
   * This method provides a time-based breakdown of reward points, allowing
   * analysis of customer reward trends over time.
   * 
   * Process:
   * 1. Loads all transactions
   * 2. Parses purchase dates to extract year and month
   * 3. Groups by unique combination of customerId, year, and month
   * 4. Sums points within each group
   * 5. Sorts by date in DESC order
   * 6. Transforms numeric months to calendar month names
   * 7. Returns paginated results
   * 
   * Algorithm:
   * - Uses Map with unique key format: "customerId-year-month"
   * - Ensures each customer-month combination is counted once
   * - Validates that all transactions have required points field
   * 
   */
  static async getMonthlyRewards(page, pageSize, order = 'year DESC, month DESC', customerNameFilter = null) {
    const transactions = await JSONDataService.loadTransactions();

    if (!transactions || transactions.length === 0) {
      return { data: [], total: 0, page, pageSize };
    }
    
    const monthlyRewardsMap = new Map();
    
    transactions.forEach((transaction) => {
      const customerId = parseInt(transaction?.customerId);
      const customerName = transaction?.customerName;
      const points = transaction?.points;

      if (points === undefined || points === null || isNaN(points)) {
        throw new Error(`Transaction ${transaction?.transactionId} missing points field`);
      }
      
      const { year, month } = this.parseDate(transaction?.purchaseDate);
      
      const uniqueKey = `${customerId}-${year}-${month}`;
      
      if (!monthlyRewardsMap.has(uniqueKey)) {
        monthlyRewardsMap.set(uniqueKey, {
          customerId,
          customerName,
          year,
          month,
          points: 0,
        });
      }
      
      monthlyRewardsMap.get(uniqueKey).points += points;
    });
    
    let monthlyRewards = Array.from(monthlyRewardsMap.values());
    
    if (customerNameFilter?.trim()) {
      const searchTerm = customerNameFilter.toLowerCase().trim();
      monthlyRewards = monthlyRewards?.filter(reward => reward?.customerName?.toLowerCase().includes(searchTerm));
    }
    
    const isAscending = order.includes('ASC');
    monthlyRewards?.sort((rewardA, rewardB) => {
      if (isAscending) {
        if (rewardA.year !== rewardB.year) return rewardA.year - rewardB.year;
        return rewardA.month - rewardB.month;
      } else {
        if (rewardA.year !== rewardB.year) return rewardB.year - rewardA.year;
        return rewardB.month - rewardA.month;
      }
    });
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    
    const transformMonthToCalendarFormat = (rewardRow) => {
      return { ...rewardRow, month: monthNames[rewardRow.month - 1] };
    };
    
    const total = monthlyRewards.length;
    
    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      const paginatedRewards = monthlyRewards.slice(offset, offset + pageSize);
      return { data: paginatedRewards.map(transformMonthToCalendarFormat), total, page, pageSize };
    } else {
      const limit = pageSize || 5000;
      const limitedRewards = monthlyRewards.slice(0, limit);
      return limitedRewards.map(transformMonthToCalendarFormat);
    }
  }
}

export default RewardsService;
