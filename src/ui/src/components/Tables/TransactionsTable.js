/* eslint-disable no-console */
import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import usePaginatedApi from '../../hooks/usePaginatedApi';
import { fetchTransactions } from '../../services/api';
import { TableContainer } from '../common/styles';
import { exportTableToCSV } from '../../utils/csvExport';
import TableActionsToolbar from './TableActionsToolbar';
import LoadingState from './LoadingState';
import DataTable from './DataTable';

const formatPrice = (price) => {
  const priceNumericValue = typeof price === 'number' ? price : parseFloat(price);
  if (priceNumericValue === null || priceNumericValue === undefined || isNaN(priceNumericValue)) {
    throw new Error('Price is required');
  } 
  return `$${priceNumericValue.toFixed(2)}`;
};

const TransactionsTable = ({ initialPageSize = 10 }) => {
  const [searchValue, setSearchValue] = useState('');
  const [queryParams, setQueryParams] = useState({ customerName: '' });
  
  /*
    The usePaginatedApi here enables respective API invocation by passing fetchTransactions
    to the hook, which performs pagination.

    Any change in the query params triggers a lifecycle change in the custom hook,
    thus leading to re-fetching of data.
  */
  const {
    data,
    loading,
    error,
    page,
    pageSize,
    total,
    onPageChange,
  } = usePaginatedApi(fetchTransactions, queryParams, { initialPage: 1, initialPageSize });

  /*
    Passed to the search box, to enable search by customer name.
    The API is called when the debouncing delay of 500 ms is done, on
    character typing in the search box.
  */
  const handleSearch = useCallback((value, shouldCallApi) => {
    setSearchValue(value);
    if (shouldCallApi) {
      setQueryParams(previousParams => ({ ...previousParams, customerName: value || '' }));
    }
  }, []);

  /*
    These columns are the ones which will be displayed on the UI table.
    We can also set fixed widths for columns.

    The columns are memoized since they need to be computed only once.
  */
  const columns = useMemo(() => [
    { title: 'Transaction ID', dataIndex: 'transactionId', key: 'transactionId' },
    { title: 'Customer ID', dataIndex: 'customerId', key: 'customerId', width: 110 },
    { title: 'Customer Name', dataIndex: 'customerName', key: 'customerName' },
    {
      title: 'Purchase Date',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
    },
    { title: 'Product', dataIndex: 'product', key: 'product' },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: formatPrice,
      width: 100,
    },
    {
      title: 'Reward Points',
      dataIndex: 'points',
      key: 'points',
      width: 140,
    },
  ], []);

  /*
    Export the currently displayed data on the table to a CSV file. This function
    does not export ALL the data in the table, but only that which is on the current page.
  */
  const handleExportCSV = useCallback(() => {
    const csvColumns = columns.filter(column => column?.dataIndex);
    exportTableToCSV(data, csvColumns, 'transactions.csv');
  }, [data, columns]);

  if (error) {
    return <Alert type="error" message="Failed to load transactions" description={String(error)} />;
  }

  return (
    <TableContainer>
      {/* This component is for Table actions, such as search or export CSV */}
      <TableActionsToolbar
        searchValue={searchValue}
        onSearchChange={handleSearch}
        onExportCSV={handleExportCSV}
      />
      {loading ? (
        <LoadingState message="Loading transactions..." />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
        />
      )}
    </TableContainer>
  );
};

export default TransactionsTable;

TransactionsTable.propTypes = {
  initialPageSize: PropTypes.number,
};
