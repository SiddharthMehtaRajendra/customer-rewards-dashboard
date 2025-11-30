import { lazy, Suspense } from 'react';
import { Spin } from 'antd';
import { DashboardContainer, DashboardTitle, TableSection, LoadingContainer } from './common/styles';

const RefreshButton = lazy(() => import('./RefreshButton'));
const Header = lazy(() => import('./Header'));
const TableSelector = lazy(() => import('./TableSelector'));

/**
 * Loading fallback component for Suspense
 */
const LoadingFallback = () => (
  <LoadingContainer>
    <Spin tip="Loading..." />
  </LoadingContainer>
);

export const Dashboard = () => {
  return (
    <DashboardContainer>
      <RefreshButton />
      <DashboardTitle>
        Customer Rewards Dashboard
      </DashboardTitle>
      <Suspense fallback={<LoadingFallback />}>
        <Header />
      </Suspense>
      <TableSection>
        <Suspense fallback={<LoadingFallback />}>
          <TableSelector limit={100} />
        </Suspense>
      </TableSection>
    </DashboardContainer>
  );
};

Dashboard.propTypes = {};