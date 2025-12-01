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
  
  const {
    data,
    loading,
    error,
    page,
    pageSize,
    total,
    onPageChange,
  } = usePaginatedApi(fetchTransactions, queryParams, { initialPage: 1, initialPageSize });

  const handleSearch = useCallback((value, shouldCallApi) => {
    setSearchValue(value);
    if (shouldCallApi) {
      setQueryParams(prev => ({ ...prev, customerName: value || undefined }));
    }
  }, []);

  const handleTableChange = useCallback((pagination, filters, sorter) => {
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

  const handleExportCSV = useCallback(() => {
    const csvColumns = columns.filter(col => col.dataIndex);
    exportTableToCSV(data, csvColumns, 'transactions.csv');
  }, [data, columns]);

  if (error) {
    return <Alert type="error" message="Failed to load transactions" description={String(error)} />;
  }

  return (
    <TableContainer>
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
