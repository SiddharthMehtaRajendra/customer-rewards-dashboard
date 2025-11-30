import DatabaseService from '../services/DatabaseService.js';
import LoggerService from '../services/LoggerService.js';

// Helper to extract pagination parameters from request query
export const getPaginationParams = (req) => {
  const page = req.query.page ? Math.max(parseInt(req.query.page), 1) : null;
  const pageSize = req.query.pageSize
    ? Math.max(parseInt(req.query.pageSize), 1)
    : req.query.limit
      ? Math.max(parseInt(req.query.limit), 1)
      : null;
  return { page, pageSize };
};

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
    LoggerService.debug('Applying customerName filter:', { customerName: req.query.customerName });
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
    const countRows = await DatabaseService.all(finalCountSql, finalParams);
    const total = countRows[0]?.count || 0;
    const offset = (page - 1) * pageSize;
    
    const rows = await DatabaseService.all(finalDataSql + ' LIMIT ? OFFSET ?', [...finalParams, pageSize, offset]);
    return { rows, total, page, pageSize };
  } else {
    // Non-paginated response
    const limit = pageSize || defaultLimit;
    const rows = await DatabaseService.all(finalDataSql + ' LIMIT ?', [...finalParams, limit]);
    return rows;
  }
};