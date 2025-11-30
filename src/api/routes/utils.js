import db from '../utils/db.js';
import logger from '../utils/logger.js';

// helper to wrap db.all in a Promise
export const dbAll = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

// helper to run an INSERT/UPDATE/DELETE and return lastID
export const dbRun = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });

// Generic pagination function
// Handles both paginated and non-paginated responses
// @param {Object} req - Express request object
// @param {string} countSql - SQL to count total rows
// @param {string} dataSql - SQL to fetch data rows
// @param {Array} params - Parameters for the SQL queries
// @param {number} defaultLimit - Default limit when pagination is not used (default: 5000)
export const paginateQuery = async (req, countSql, dataSql, params = [], defaultLimit = 5000) => {
  const page = req.query.page ? Math.max(parseInt(req.query.page), 1) : null;
  const pageSize = req.query.pageSize
    ? Math.max(parseInt(req.query.pageSize), 1)
    : req.query.limit
      ? Math.max(parseInt(req.query.limit), 1)
      : null;

  // Build dynamic WHERE clause for customerName filter
  let finalCountSql = countSql;
  let finalDataSql = dataSql;
  const finalParams = [...params];

  if (req.query.customerName) {
    logger.debug('Applying customerName filter:', { customerName: req.query.customerName });
    const searchTerm = `%${req.query.customerName}%`;
    
    // Add filter to count SQL - insert WHERE/AND before any existing ORDER BY
    if (countSql.includes('WHERE')) {
      // Already has WHERE, just append AND
      finalCountSql = countSql + ' AND customerName LIKE ?';
      finalDataSql = dataSql + ' AND customerName LIKE ?';
    } else {
      // No WHERE clause yet
      finalCountSql = countSql + ' WHERE customerName LIKE ?';
      finalDataSql = dataSql.replace(/ORDER BY/, 'WHERE customerName LIKE ? ORDER BY') || dataSql + ' WHERE customerName LIKE ?';
    }
    
    finalParams.push(searchTerm);
  }

  if (page && pageSize) {
    // Paginated response
    const countRows = await dbAll(finalCountSql, finalParams);
    const total = countRows[0]?.count || 0;
    const offset = (page - 1) * pageSize;
    
    const rows = await dbAll(finalDataSql + ' LIMIT ? OFFSET ?', [...finalParams, pageSize, offset]);
    return { rows, total, page, pageSize };
  } else {
    // Non-paginated response
    const limit = pageSize || defaultLimit;
    const rows = await dbAll(finalDataSql + ' LIMIT ?', [...finalParams, limit]);
    return rows;
  }
};