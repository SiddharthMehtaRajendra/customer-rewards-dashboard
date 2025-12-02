/* eslint-disable */
/**
 * JSONDataService - Loads and caches transaction data from transactions.json
 * 
 * A service class that handles loading and caching transaction data from JSON files
 * in the public folder. 
 *
 */

class JSONDataService {
  /**
   * In-memory cache for loaded transactions
   */
  static transactionsCache = null;
  
  /**
   * Path to the JSON data file in the public folder
   * Default points to /transactions.json
   */
  static dataPath = '/transactions.json';

  /**
   * Initializes the service with a custom data path
   * 
   * This method should be called once at application startup to configure
   * where transaction data should be loaded from.
   * 
   */
  static initialize(dataPath) {
    if (dataPath) {
      this.dataPath = dataPath;
    }
  }

  /**
   * Loads transaction data from the configured JSON file
   * 
   * This method fetches the JSON file from the public folder and caches the result.
   * It includes a timestamp query parameter to prevent browser caching and ensure
   * fresh data is loaded each time.
   * 
   * Error Handling:
   * - If the file doesn't exist or can't be loaded, returns an empty array
   */
  static async loadTransactions() {
    try {
      const response = await fetch(this.dataPath + `?v=${Date.now()}`); // Cache-busting query param
      if (!response.ok) {
        throw new Error(`Failed to load transactions: ${response.statusText}`);
      }
      const data = await response.json();
      this.transactionsCache = data;
    } catch (error) {
      this.transactionsCache = [];
    }
    
    return this.transactionsCache;
  }

  /**
   * Saves transactions to the in-memory cache
   *
   */
  static saveTransactions(transactions) {
    // In the browser, we only update the cache
    this.transactionsCache = transactions;
  }
}

export default JSONDataService;
