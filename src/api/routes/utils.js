import DatabaseService from '../services/DatabaseService.js';
import LoggerService from '../services/LoggerService.js';

export const getPaginationParams = (req) => {
  const page = req.query.page ? Math.max(parseInt(req.query.page), 1) : null;
  const pageSize = req.query.pageSize
    ? Math.max(parseInt(req.query.pageSize), 1)
    : req.query.limit
      ? Math.max(parseInt(req.query.limit), 1)
      : null;
  return { page, pageSize };
};

export const paginateQuery = async (req, countSql, dataSql, params = [], defaultLimit = 5000) => {
  const page = req.query.page ? Math.max(parseInt(req.query.page), 1) : null;
  const pageSize = req.query.pageSize
    ? Math.max(parseInt(req.query.pageSize), 1)
    : req.query.limit
      ? Math.max(parseInt(req.query.limit), 1)
      : null;

  let finalCountSql = countSql;
  let finalDataSql = dataSql;
  const finalParams = [...params];

  if (req.query.customerName) {
    LoggerService.debug('Applying customerName filter:', { customerName: req.query.customerName });
    const searchTerm = `%${req.query.customerName}%`;
    
    if (countSql.includes('WHERE')) {
      finalCountSql = countSql + ' AND customerName LIKE ?';
      finalDataSql = dataSql + ' AND customerName LIKE ?';
    } else {
      finalCountSql = countSql + ' WHERE customerName LIKE ?';
      finalDataSql = dataSql.replace(/ORDER BY/, 'WHERE customerName LIKE ? ORDER BY') || dataSql + ' WHERE customerName LIKE ?';
    }
    
    finalParams.push(searchTerm);
  }

  if (page && pageSize) {
    const countRows = await DatabaseService.all(finalCountSql, finalParams);
    const total = countRows[0]?.count || 0;
    const offset = (page - 1) * pageSize;
    
    const rows = await DatabaseService.all(finalDataSql + ' LIMIT ? OFFSET ?', [...finalParams, pageSize, offset]);
    return { rows, total, page, pageSize };
  } else {
    const limit = pageSize || defaultLimit;
    const rows = await DatabaseService.all(finalDataSql + ' LIMIT ?', [...finalParams, limit]);
    return rows;
  }
};