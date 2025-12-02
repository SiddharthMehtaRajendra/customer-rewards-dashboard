import DatabaseService from './DatabaseService.js';
import LoggerService from './LoggerService.js';
import { INSERT_MONTHLY, INSERT_TOTAL } from '../utils/sql.js';

class RewardsService {
  static async populateMonthlyRewards() {
    await DatabaseService.run(INSERT_MONTHLY);
    LoggerService.debug('Monthly rewards populated');
  }

  static async populateTotalRewards() {
    await DatabaseService.run(INSERT_TOTAL);
    LoggerService.debug('Total rewards populated');
  }

  static async getTotalRewards(page, pageSize, customerNameFilter = null) {
    let countSql = 'SELECT COUNT(*) AS count FROM total_rewards';
    let dataSql = 'SELECT * FROM total_rewards ORDER BY customerId ASC';
    const params = [];

    if (customerNameFilter) {
      const searchTerm = `%${customerNameFilter}%`;
      countSql += ' WHERE customerName LIKE ?';
      dataSql = dataSql.replace(/ORDER BY/, 'WHERE customerName LIKE ? ORDER BY');
      params.push(searchTerm);
    }

    if (page && pageSize) {
      const countRows = await DatabaseService.all(countSql, params);
      const total = countRows[0]?.count || 0;
      const offset = (page - 1) * pageSize;
      const rows = await DatabaseService.all(dataSql + ' LIMIT ? OFFSET ?', [...params, pageSize, offset]);
      return { rows, total, page, pageSize };
    } else {
      const limit = pageSize || 5000;
      const rows = await DatabaseService.all(dataSql + ' LIMIT ?', [...params, limit]);
      return rows;
    }
  }

  static async getMonthlyRewards(page, pageSize, order = 'year DESC, month DESC', customerNameFilter = null) {
    let countSql = 'SELECT COUNT(*) AS count FROM monthly_rewards';
    let dataSql = `SELECT * FROM monthly_rewards ORDER BY ${order}`;
    const params = [];

    if (customerNameFilter) {
      const searchTerm = `%${customerNameFilter}%`;
      countSql += ' WHERE customerName LIKE ?';
      dataSql = dataSql.replace(/ORDER BY/, 'WHERE customerName LIKE ? ORDER BY');
      params.push(searchTerm);
    }

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const transformMonthToGregorian = (row) => {
      const monthValue = row.month;
      const monthNumber = Number(monthValue);
      if (!Number.isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
        return { ...row, month: monthNames[monthNumber - 1] };
      }
      return row;
    };

    if (page && pageSize) {
      const countRows = await DatabaseService.all(countSql, params);
      const total = countRows[0]?.count || 0;
      const offset = (page - 1) * pageSize;
      const rows = await DatabaseService.all(dataSql + ' LIMIT ? OFFSET ?', [...params, pageSize, offset]);
      return { rows: rows.map(transformMonthToGregorian), total, page, pageSize };
    } else {
      const limit = pageSize || 5000;
      const rows = await DatabaseService.all(dataSql + ' LIMIT ?', [...params, limit]);
      return rows.map(transformMonthToGregorian);
    }
  }

  static async getTopRewardsByCustomer(customerId, limit = 3) {
    const countSql = 'SELECT COUNT(*) AS count FROM monthly_rewards WHERE customerId = ?';
    const dataSql = 'SELECT year, month, points FROM monthly_rewards WHERE customerId = ? ORDER BY points DESC LIMIT ?';
    const countRows = await DatabaseService.all(countSql, [customerId]);
    const rows = await DatabaseService.all(dataSql, [customerId, limit]);
    return { count: countRows[0]?.count || 0, rows };
  }

  static async updateRewardsTables() {
    await DatabaseService.run('DELETE FROM monthly_rewards');
    await DatabaseService.run('DELETE FROM total_rewards');
    
    await RewardsService.populateMonthlyRewards();
    await RewardsService.populateTotalRewards();
    
    LoggerService.debug('Rewards tables updated');
  }
}

export default RewardsService;
