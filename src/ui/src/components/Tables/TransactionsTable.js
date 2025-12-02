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

const formatPrice = (val) => (typeof val === 'number' ? `$${val.toFixed(2)}` : val);

const TransactionsTable = ({ initialPageSize = 10 }) => {
  const [searchValue, setSearchValue] = useState('');
  const [sortState, setSortState] = useState({ field: null, order: null });
  const [queryParams, setQueryParams] = useState({ customerName: undefined });
  
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
      setQueryParams(prev => ({ ...prev, customerName: value || '' }));
    }
  }, []);

  /*
    This function is called natively by the Antd table when there is a change event
    in the table, such as currently for sorting by date in the fetch all transactions
    table. It sends the sort parameters to the API so that the DB query can be modified
    to return results in either ascending or descending order.
  */
  const handleTableChange = useCallback((_, _, sorter) => {
    if (sorter && sorter.field) {
      let newOrder = 'asc';
      if (sortState.field === sorter.field) {
        if (sortState.order === 'asc') {
          newOrder = 'desc';
        } else if (sortState.order === 'desc') {
          newOrder = null;
        }
      }

      setSortState({ field: sorter.field, order: newOrder });

      setQueryParams(prev => ({
        ...prev,
        ...(newOrder ? { sortBy: sorter.field, sortOrder: newOrder } : { sortBy: undefined, sortOrder: undefined }),
      }));
    }
  }, [sortState]);

  /*
    These columns are the ones which will be displayed on the UI table.
    Columns which are sortable have a sorter flag enabled in their record.
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
      sorter: true,
      sortOrder: sortState.field === 'purchaseDate' ? sortState.order : null,
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
      title: 'Rewards Points',
      dataIndex: 'rewardsPoints',
      key: 'rewardsPoints',
      width: 140,
    },
  ], [sortState]);

  /*
    Export the currently displayed data on the table to a CSV file. This function
    does not export ALL the data in the table, but only that which is on the current page.
  */
  const handleExportCSV = useCallback(() => {
    const csvColumns = columns.filter(col => col.dataIndex);
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
          onChange={handleTableChange}
        />
      )}
    </TableContainer>
  );
};

export default TransactionsTable;

TransactionsTable.propTypes = {
  initialPageSize: PropTypes.number,
};
