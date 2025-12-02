import JSONDataService from './JSONDataService.js';

/**
 * TransactionService - Transaction Management and Rewards Calculation
 * 
 * Reward Points Calculation Rules:
 * - Purchases $0-$50: 0 points
 * - Purchases $51-$100: 1 point per dollar over $50
 * - Purchases over $100: 2 points per dollar over $100, plus 50 points
 * 
 * Example calculations:
 * - $45 purchase = 0 points
 * - $75 purchase = 25 points (75 - 50)
 * - $120 purchase = 90 points ((120 - 100) * 2 + 50)
 * 
 * Date Format:
 * All dates use DD-MM-YYYY format (e.g., '25-12-2024')
 * 
 */
class TransactionService {
  /**
   * Parses a date string in DD-MM-YYYY format into a JavaScript Date object
   * 
   */
  static parseDate(dateStr) {
    // Parse DD-MM-YYYY format
    const parts = dateStr.split('-');
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }

  /**
   * Formats a JavaScript Date object into DD-MM-YYYY string format
   */
  static formatDate(date) {
    // Format as DD-MM-YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  /**
   * Calculates reward points based on purchase price
   * 
   * Implements the business rule for reward points calculation:
   * - $0 to $50: 0 points
   * - $51 to $100: 1 point per dollar above $50
   * - Over $100: 2 points per dollar above $100, plus 50 points for the $51-$100 range
   * 
   * Formula for purchases over $100:
   * points = 50 + (2 × (price - 100))
   */
  static calculatePoints(price) {
    const priceNum = parseFloat(price);
    if (priceNum <= 50) {
      return 0;
    } else if (priceNum <= 100) {
      return Math.floor(priceNum - 50);
    } else {
      return 50 + 2 * Math.floor(priceNum - 100);
    }
  }

  static sortTransactions(transactions, field, isAscending) {
    transactions.sort((transactionA, transactionB) => {
      let firstValue, secondValue;
      if (field === 'purchaseDate') {
        firstValue = this.parseDate(transactionA.purchaseDate);
        secondValue = this.parseDate(transactionB.purchaseDate);
      } else if (field === 'price' || field === 'points') {
        firstValue = parseFloat(transactionA[field]);
        secondValue = parseFloat(transactionB[field]);
      } else if (field === 'customerId') {
        firstValue = parseInt(transactionA.customerId);
        secondValue = parseInt(transactionB.customerId);
      } else {
        firstValue = transactionA[field];
        secondValue = transactionB[field];
      }
      
      if (firstValue < secondValue) return isAscending ? -1 : 1;
      if (firstValue > secondValue) return isAscending ? 1 : -1;

      return 0;
    });
  }
  
  /**
   * Retrieves transactions with filtering, sorting, and pagination
   * 
   * This is the main method for querying transaction data. It supports:
   * - Customer name filtering (case-insensitive partial match)
   * - Pagination for large datasets
   * 
   * Pagination Logic:
   * - If both page and pageSize are provided, returns paginated results
   */
  static async getTransactions(page, pageSize, orderBy = 'purchaseDate DESC', customerNameFilter = null) {
    let transactions = await JSONDataService.loadTransactions();
    
    // Apply customer name filter
    if (customerNameFilter && customerNameFilter.trim()) {
      const searchTerm = customerNameFilter.toLowerCase().trim();
      transactions = transactions.filter(txn => 
        txn?.customerName?.toLowerCase().includes(searchTerm),
      );
    }
    
    const [field, direction = 'DESC'] = orderBy.split(' ');
    const isAscending = direction.toUpperCase() === 'ASC';

    TransactionService.sortTransactions(transactions, field, isAscending);
    
    const total = transactions.length;
    
    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      const paginatedTransactions = transactions.slice(offset, offset + pageSize);
      return { data: paginatedTransactions, total, page, pageSize };
    } else {
      const limit = pageSize || 5000;
      const limitedTransactions = transactions.slice(0, limit);
      return limitedTransactions;
    }
  }
}

export default TransactionService;
