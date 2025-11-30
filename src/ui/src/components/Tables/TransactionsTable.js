import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Table as AntTable, Spin, Alert } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import usePaginatedApi from '../../hooks/usePaginatedApi';
import { fetchTransactions } from '../../services/api';
import SearchBox from '../SearchBox';
import { TableContainer, LoadingContainer, TableWrapper, ExportButton, TableActions, SearchBoxWrapper, ExportButtonWrapper } from '../common/styles';
import { exportTableToCSV } from '../../utils/csvExport';

const TransactionsTable = ({ initialPageSize = 10 }) => {
  const [searchValue, setSearchValue] = useState('');
  const [sortState, setSortState] = useState({ field: null, order: null });
  const {
    data,
    loading,
    error,
    current,
    pageSize,
    total,
    handlePageChange,
    setParams,
  } = usePaginatedApi(fetchTransactions, { initialPage: 1, initialPageSize });

  const handleSearch = useCallback((value, shouldCallApi) => {
    setSearchValue(value);
    if (shouldCallApi) {
      setParams({ customerName: value || undefined });
    }
  }, [setParams]);

  const handleTableChange = useCallback((sorter) => {
    if (sorter && sorter.field) {
      // Determine the next sort order: null -> asc -> desc -> null
      let newOrder = 'asc';
      if (sortState.field === sorter.field) {
        if (sortState.order === 'asc') {
          newOrder = 'desc';
        } else if (sortState.order === 'desc') {
          newOrder = null;
        }
      }

      setSortState({ field: sorter.field, order: newOrder });

      const sortParams = newOrder ? {
        sortBy: sorter.field,
        sortOrder: newOrder,
      } : {};

      setParams(sortParams);
    }
  }, [setParams, sortState]);

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
      render: (val) => (typeof val === 'number' ? `$${val.toFixed(2)}` : val),
      width: 100,
    },
    {
      title: 'Rewards Points',
      dataIndex: 'rewardsPoints',
      key: 'rewardsPoints',
      width: 140,
    },
  ], [sortState]);

  const handleExportCSV = useCallback(() => {
    const csvColumns = columns.filter(col => col.dataIndex);
    exportTableToCSV(data, csvColumns, 'transactions.csv');
  }, [data, columns]);

  if (error) return <Alert type="error" message="Failed to load transactions" description={String(error)} />;

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
          <Spin tip="Loading transactions..." />
        </LoadingContainer>
      ) : (
        <TableWrapper>
          <AntTable
            columns={columns}
            dataSource={data}
            onChange={handleTableChange}
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

export default TransactionsTable;

TransactionsTable.propTypes = {
  initialPageSize: PropTypes.number,
};
