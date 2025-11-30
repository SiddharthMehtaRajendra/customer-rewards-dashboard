/**
 * Convert array of objects to CSV string
 * @param {Array} data - Array of objects to convert
 * @param {Array} columns - Array of column definitions with dataIndex and title
 * @returns {string} CSV formatted string
 */
export const convertToCSV = (data, columns) => {
  if (!data || data.length === 0) return '';

  // Extract headers from columns
  const headers = columns.map(col => col.title).join(',');
  
  // Convert each row to CSV format
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col.dataIndex];
      // Handle null/undefined
      if (value === null || value === undefined) return '';
      // Escape quotes and wrap in quotes if contains comma or quote
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });

  return [headers, ...rows].join('\n');
};

/**
 * Trigger download of CSV file
 * @param {string} csvContent - CSV formatted string
 * @param {string} filename - Name of the file to download
 */
export const downloadCSV = (csvContent, filename = 'export.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Export table data to CSV
 * @param {Array} data - Array of data objects
 * @param {Array} columns - Array of column definitions
 * @param {string} filename - Name of the file to download
 */
export const exportTableToCSV = (data, columns, filename = 'export.csv') => {
  const csvContent = convertToCSV(data, columns);
  downloadCSV(csvContent, filename);
};
