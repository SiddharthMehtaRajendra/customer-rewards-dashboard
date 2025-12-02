import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import usePaginatedApi from '../../hooks/usePaginatedApi';
import { fetchRewardsMonthly } from '../../services/api';
import { TableContainer } from '../common/styles';
import { exportTableToCSV } from '../../utils/csvExport';
import TableActionsToolbar from './TableActionsToolbar';
import LoadingState from './LoadingState';
import DataTable from './DataTable';

const MonthlyRewardsTable = ({ initialPageSize = 10 }) => {
  const [searchValue, setSearchValue] = useState('');
  const [queryParams, setQueryParams] = useState({ customerName: undefined });
  
  const {
    data,
    loading,
    error,
    page,
    pageSize,
    total,
    onPageChange,
  } = usePaginatedApi(fetchRewardsMonthly, queryParams, { initialPage: 1, initialPageSize });

  const handleSearch = useCallback((value, shouldCallApi) => {
    setSearchValue(value);
    if (shouldCallApi) {
      setQueryParams(prev => ({ ...prev, customerName: value || undefined }));
    }
  }, []);

  const columns = useMemo(() => [
    { title: 'Customer ID', dataIndex: 'customerId', key: 'customerId' },
    { title: 'Customer Name', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Month', dataIndex: 'month', key: 'month' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Monthly Rewards', dataIndex: 'points', key: 'monthlyRewards' },
  ], []);

  const handleExportCSV = useCallback(() => {
    const csvColumns = columns.filter(col => col.dataIndex);
    exportTableToCSV(data, csvColumns, 'monthly-rewards.csv');
  }, [data, columns]);

  if (error) {
    return <Alert type="error" message="Failed to load monthly rewards" description={String(error)} />;
  }

  return (
    <TableContainer>
      <TableActionsToolbar
        searchValue={searchValue}
        onSearchChange={handleSearch}
        onExportCSV={handleExportCSV}
      />
      {loading ? (
        <LoadingState message="Loading monthly rewards..." />
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

export default MonthlyRewardsTable;

MonthlyRewardsTable.propTypes = {
  initialPageSize: PropTypes.number,
};
