/* eslint-disable no-console */
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import usePaginatedApi from '../../hooks/usePaginatedApi';
import { fetchTransactions } from '../../utils/api';
import { TableContainer } from '../common/styles';
import { exportTableToCSV } from '../../utils/csvExport';
import TableActionsToolbar from './TableActionsToolbar';
import LoadingState from './LoadingState';
import DataTable from './DataTable';
import { TRANSACTIONS_TABLE_COLUMNS } from '../../utils/constants';

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
    Export the currently displayed data on the table to a CSV file. This function
    does not export ALL the data in the table, but only that which is on the current page.
  */
  const handleExportCSV = useCallback(() => {
    const csvColumns = TRANSACTIONS_TABLE_COLUMNS.filter(column => column?.dataIndex);
    exportTableToCSV(data, csvColumns, 'transactions.csv');
  }, [data]);

  if (error) {
    return <Alert type="error" message="Failed to load transactions" description={error?.message || JSON.stringify(error)} />;
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
          columns={TRANSACTIONS_TABLE_COLUMNS}
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
