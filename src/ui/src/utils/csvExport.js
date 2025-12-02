export const convertToCSV = (data, columns) => {
  if (!data || data.length === 0) return '';

  const headers = columns.map(col => col.title).join(',');
  
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col.dataIndex];
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });

  return [headers, ...rows].join('\n');
};

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
