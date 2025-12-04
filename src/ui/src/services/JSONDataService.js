/* eslint-disable */
/**
 * JSONDataService - Loads and caches transaction data from transactions.json
 * 
 * A service class that handles loading and caching transaction data from JSON files
 * in the public folder. 
 *
 */

import { TRANSACTIONS_DATA_JSON_PATH } from "../utils/constants";
import JSONValidatorService from "./JSONValidatorService";

class JSONDataService {
  /**
   * In-memory cache for loaded transactions
   * Resets once the page is reloaded
   */
  static transactionsCache = [];
  
  /**
   * Path to the JSON data file in the public folder
   * Default points to /transactions.json
   */
  static dataPath = TRANSACTIONS_DATA_JSON_PATH;

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
   * It includes a timestamp query parameter to prevent browser caching and ensures
   * fresh data is loaded each time.
   * 
   * I did not use browser local storage as I want the data to be freshly loaded on
   * page refresh.
   * 
   * Error Handling:
   * - If the file doesn't exist or can't be loaded, returns an empty array
   */
  static async loadTransactions() {
    try {
      if (this.transactionsCache?.length > 0) {
        return this.transactionsCache;
      }
      const response = await fetch(this.dataPath + `?v=${Date.now()}`); // Cache-busting query param
      if (!response.ok) {
        throw new Error(`Failed to load transactions: ${response.statusText}`);
      }
      const data = await response.json();
      const { isValidJSONCalculations, dirtyTransactionRecord }
        = JSONValidatorService.verifyJSONRewardPoints(data);
      if (!isValidJSONCalculations) {
        throw new Error('Invalid JSON Calculations, refer transaction - ' + JSON.stringify(dirtyTransactionRecord));
      } 
      this.transactionsCache = data;
    } catch (error) {
      this.transactionsCache = [];
      throw new Error('Error loading transactions: ' + error?.message);
    }
    return this.transactionsCache;
  }
}

export default JSONDataService;
