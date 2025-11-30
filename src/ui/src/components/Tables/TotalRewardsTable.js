import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Table as AntTable, Spin, Alert } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import usePaginatedApi from '../../hooks/usePaginatedApi';
import { fetchRewardsTotal } from '../../services/api';
import SearchBox from '../SearchBox';
import { TableContainer, LoadingContainer, TableWrapper, ExportButton, TableActions, SearchBoxWrapper, ExportButtonWrapper } from '../common/styles';
import { exportTableToCSV } from '../../utils/csvExport';

const TotalRewardsTable = ({ initialPageSize = 10 }) => {
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
  } = usePaginatedApi(fetchRewardsTotal, { initialPage: 1, initialPageSize });

  const handleSearch = useCallback((value, shouldCallApi) => {
    setSearchValue(value);
    if (shouldCallApi) {
      setParams({ customerName: value || undefined });
    }
  }, [setParams]);

  const columns = useMemo(() => [
    { title: 'Customer ID', dataIndex: 'customerId', key: 'customerId' },
    { title: 'Customer Name', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Total Rewards', dataIndex: 'totalPoints', key: 'totalRewards' },
  ], []);

  const handleExportCSV = useCallback(() => {
    const csvColumns = columns.filter(col => col.dataIndex);
    exportTableToCSV(data, csvColumns, 'total-rewards.csv');
  }, [data, columns]);

  if (error) return <Alert type="error" message="Failed to load total rewards" description={String(error)} />;

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
          <Spin tip="Loading total rewards..." />
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

export default TotalRewardsTable;

TotalRewardsTable.propTypes = {
  initialPageSize: PropTypes.number,
};
