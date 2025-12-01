import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import LoggerService from './LoggerService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CSVService {
  static convertToCSV(data, headers) {
    if (!data || data.length === 0) return '';

    const headerRow = headers.join(',');
    const rows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(','),
    );

    return [headerRow, ...rows].join('\n');
  }

  static writeToCSV(filename, data, headers, subdirectory = '') {
    const csvContent = this.convertToCSV(data, headers);
    const seedDataDir = path.join(__dirname, '../seed-data', subdirectory);
    
    if (!fs.existsSync(seedDataDir)) {
      fs.mkdirSync(seedDataDir, { recursive: true });
    }

    const filePath = path.join(seedDataDir, filename);
    fs.writeFileSync(filePath, csvContent, 'utf8');
    LoggerService.info('Data written to CSV:', { filePath, count: data.length });
    
    return filePath;
  }

  static writeTransactions(transactions) {
    const headers = ['customerId', 'transactionId', 'customerName', 'purchaseDate', 'product', 'price'];
    return this.writeToCSV('transactions.csv', transactions, headers);
  }
}

export default CSVService;
