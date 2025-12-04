import { Suspense, lazy, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { useAppState , useAppDispatch } from '../context/AppContext';
import { LoadingContainer } from './common/styles';
import { TABLE_TYPE } from '../utils/constants';

const TransactionsTable = lazy(() => import('./Tables/TransactionsTable'));
const MonthlyRewardsTable = lazy(() => import('./Tables/MonthlyRewardsTable'));
const TotalRewardsTable = lazy(() => import('./Tables/TotalRewardsTable'));


/*
  This file lazily loads the respective tables for fetching all transactions,
  monthly rewards or the total rewards, as per the card selections made in
  Header.js.

  It loads the transactions table by default on first page paint.
*/
const TableSelector = ({
  initialPageSize = 10,
}) => {
  const appState = useAppState();
  const { currentTable } = appState;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch({ type: 'SWITCH_TABLE', payload: TABLE_TYPE.TRANSACTIONS_TABLE });
  }, [dispatch]);

  const fallback = (
    <LoadingContainer>
      <Spin tip="Loading table..." />
    </LoadingContainer>
  );

  if (currentTable === TABLE_TYPE.MONTHLY_REWARDS_TABLE) {
    return (
      <Suspense fallback={fallback}>
        <MonthlyRewardsTable
          initialPageSize={initialPageSize}
        />
      </Suspense>
    );
  }

  if (currentTable === TABLE_TYPE.TOTAL_REWARDS_TABLE) {
    return (
      <Suspense fallback={fallback}>
        <TotalRewardsTable initialPageSize={initialPageSize} />
      </Suspense>
    );
  }

  if (currentTable === TABLE_TYPE.TRANSACTIONS_TABLE) {
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
