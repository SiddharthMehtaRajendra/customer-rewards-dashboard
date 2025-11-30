import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import LoggerService from './LoggerService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * CSV Service for writing data to CSV files
 */
class CSVService {
  /**
   * Convert array of objects to CSV string
   * @param {Array} data - Array of data objects
   * @param {Array} headers - Array of header names
   * @returns {string} CSV formatted string
   */
  static convertToCSV(data, headers) {
    if (!data || data.length === 0) return '';

    const headerRow = headers.join(',');
    const rows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle null/undefined
        if (value === null || value === undefined) return '';
        // Escape quotes and wrap in quotes if contains comma or quote
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(','),
    );

    return [headerRow, ...rows].join('\n');
  }

  /**
   * Write data to CSV file
   * @param {string} filename - Name of the CSV file
   * @param {Array} data - Array of data objects
   * @param {Array} headers - Array of header names
   * @param {string} subdirectory - Optional subdirectory within seed-data
   */
  static writeToCSV(filename, data, headers, subdirectory = '') {
    const csvContent = this.convertToCSV(data, headers);
    const seedDataDir = path.join(__dirname, '../seed-data', subdirectory);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(seedDataDir)) {
      fs.mkdirSync(seedDataDir, { recursive: true });
    }

    const filePath = path.join(seedDataDir, filename);
    fs.writeFileSync(filePath, csvContent, 'utf8');
    LoggerService.info('Data written to CSV:', { filePath, count: data.length });
    
    return filePath;
  }

  /**
   * Write transactions to CSV file
   * @param {Array} transactions - Array of transaction objects
   */
  static writeTransactions(transactions) {
    const headers = ['customerId', 'transactionId', 'customerName', 'purchaseDate', 'product', 'price'];
    return this.writeToCSV('transactions.csv', transactions, headers);
  }
}

export default CSVService;
