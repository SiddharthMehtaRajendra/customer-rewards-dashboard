/**
 * 
 * This function converts the data displayed on the table on UI, as per the
 * columns displayed, into a CSV representation which is valid for Web APIs
 * to convert to a CSV file to be downloaded.
 * 
 * @param {array} data 
 * @param {array} columns 
 * @returns Javascript representation of CSV.
 */

export const convertToCSV = (data, columns) => {
  if (!data || data?.length === 0) return '';

  const headers = columns.map(column => column?.title).join(',');
  
  const csvRows = data.map(row => {
    return columns.map(column => {
      const value = row?.[column?.dataIndex];
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });

  return [headers, ...csvRows].join('\n');
};

/**
 * This function converts the Javascript representation of the csv file
 * to a downloadable format, which is then downloaded using an invisible link
 * that is clicked programatically to trigger a CSV download.
 * 
 * @param {*} csvContent 
 * @param {string} filename 
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

export const exportTableToCSV = (data, columns, filename = 'export.csv') => {
  const csvContent = convertToCSV(data, columns);
  downloadCSV(csvContent, filename);
};
