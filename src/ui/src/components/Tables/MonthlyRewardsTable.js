import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Table as AntTable, Spin, Alert } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import usePaginatedApi from '../../hooks/usePaginatedApi';
import { fetchRewardsMonthly } from '../../services/api';
import SearchBox from '../SearchBox';
import { TableContainer, LoadingContainer, TableWrapper, ExportButton, TableActions, SearchBoxWrapper, ExportButtonWrapper } from '../common/styles';
import { exportTableToCSV } from '../../utils/csvExport';

const MonthlyRewardsTable = ({ initialPageSize = 10 }) => {
  const [searchValue, setSearchValue] = useState('');
  const {
    data,
    loading,
    error,
    current,
    pageSize,
    total,
    handlePageChange,
    setParams,
  } = usePaginatedApi(fetchRewardsMonthly, { initialPage: 1, initialPageSize });

  const handleSearch = useCallback((value, shouldCallApi) => {
    setSearchValue(value);
    if (shouldCallApi) {
      setParams({ customerName: value || undefined });
    }
  }, [setParams]);

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

  if (error) return <Alert type="error" message="Failed to load monthly rewards" description={String(error)} />;

  return (
    <TableContainer>
      <TableActions>
        <SearchBoxWrapper>
          <SearchBox searchValue={searchValue} onSearchChange={handleSearch} />
        </SearchBoxWrapper>
        <ExportButtonWrapper>
          <ExportButton icon={<DownloadOutlined />} onClick={handleExportCSV}>
            Export to CSV
          </ExportButton>
        </ExportButtonWrapper>
      </TableActions>
      {loading ? (
        <LoadingContainer>
          <Spin tip="Loading monthly rewards..." />
        </LoadingContainer>
      ) : (
        <TableWrapper>
          <AntTable
            columns={columns}
            dataSource={data}
            pagination={{
              current,
              pageSize,
              total,
              showSizeChanger: true,
              onChange: handlePageChange,
            }}
            scroll={{ x: true }}
          />
        </TableWrapper>
      )}
    </TableContainer>
  );
};

export default MonthlyRewardsTable;

MonthlyRewardsTable.propTypes = {
  initialPageSize: PropTypes.number,
};
