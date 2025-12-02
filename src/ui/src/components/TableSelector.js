import { Suspense, lazy, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { useAppState , useAppDispatch } from '../context/AppContext';
import { LoadingContainer } from './common/styles';

const TransactionsTable = lazy(() => import('./Tables/TransactionsTable'));
const MonthlyRewardsTable = lazy(() => import('./Tables/MonthlyRewardsTable'));
const TotalRewardsTable = lazy(() => import('./Tables/TotalRewardsTable'));

const TableSelector = ({
  initialPageSize = 10,
}) => {
  const appState = useAppState();
  const { currentTable } = appState;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch({ type: 'SWITCH_TABLE', payload: 'transactions' });
  }, [dispatch]);

  const fallback = (
    <LoadingContainer>
      <Spin tip="Loading table..." />
    </LoadingContainer>
  );

  if (currentTable === 'monthly') {
    return (
      <Suspense fallback={fallback}>
        <MonthlyRewardsTable
          initialPageSize={initialPageSize}
        />
      </Suspense>
    );
  }

  if (currentTable === 'total') {
    return (
      <Suspense fallback={fallback}>
        <TotalRewardsTable initialPageSize={initialPageSize} />
      </Suspense>
    );
  }

  if (currentTable === 'transactions') {
    return (
      <Suspense fallback={fallback}>
        <TransactionsTable initialPageSize={initialPageSize} />
      </Suspense>
    );
  }

  return null;
};

export default TableSelector;

TableSelector.propTypes = {
  initialPageSize: PropTypes.number,
};
