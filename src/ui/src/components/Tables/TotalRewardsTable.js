import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import usePaginatedApi from '../../hooks/usePaginatedApi';
import { fetchRewardsTotal } from '../../services/api';
import { TableContainer } from '../common/styles';
import { exportTableToCSV } from '../../utils/csvExport';
import TableActionsToolbar from './TableActionsToolbar';
import LoadingState from './LoadingState';
import DataTable from './DataTable';

const TotalRewardsTable = ({ initialPageSize = 10 }) => {
  const [searchValue, setSearchValue] = useState('');
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
  } = usePaginatedApi(fetchRewardsTotal, queryParams, { initialPage: 1, initialPageSize });

  /*
    Passed to the search box, to enable search by customer name.
    The API is called when the debouncing delay of 500 ms is done, on
    character typing in the search box.
  */
  const handleSearch = useCallback((value, shouldCallApi) => {
    setSearchValue(value);
    if (shouldCallApi) {
      setQueryParams(prev => ({ ...prev, customerName: value || undefined }));
    }
  }, []);

  /*
    These columns are the ones which will be displayed on the UI table.

    The columns are memoized since they need to be computed only once.
  */
  const columns = useMemo(() => [
    { title: 'Customer ID', dataIndex: 'customerId', key: 'customerId' },
    { title: 'Customer Name', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Total Rewards', dataIndex: 'totalPoints', key: 'totalRewards' },
  ], []);

  /*
    Export the currently displayed data on the table to a CSV file. This function
    does not export ALL the data in the table, but only that which is on the current page.
  */
  const handleExportCSV = useCallback(() => {
    const csvColumns = columns.filter(col => col.dataIndex);
    exportTableToCSV(data, csvColumns, 'total-rewards.csv');
  }, [data, columns]);

  if (error) {
    return <Alert type="error" message="Failed to load total rewards" description={String(error)} />;
  }

  return (
    <TableContainer>
      <TableActionsToolbar
        searchValue={searchValue}
        onSearchChange={handleSearch}
        onExportCSV={handleExportCSV}
      />
      {loading ? (
        <LoadingState message="Loading total rewards..." />
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

export default TotalRewardsTable;

TotalRewardsTable.propTypes = {
  initialPageSize: PropTypes.number,
};
