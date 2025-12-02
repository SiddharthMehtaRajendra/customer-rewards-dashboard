import { lazy, Suspense } from 'react';
import { Spin } from 'antd';
import { DashboardContainer, DashboardTitle, TableSection, LoadingContainer } from './common/styles';

const RefreshButton = lazy(() => import('./RefreshButton'));
const Header = lazy(() => import('./Header'));
const TableSelector = lazy(() => import('./TableSelector'));

const LoadingFallback = () => (
  <LoadingContainer>
    <Spin tip="Loading..." />
  </LoadingContainer>
);

export const Dashboard = () => {
  return (
    <DashboardContainer>
      <Suspense fallback={<LoadingFallback />}>
        <RefreshButton />
      </Suspense>
      <DashboardTitle>
        Customer Rewards Dashboard
      </DashboardTitle>
      <Suspense fallback={<LoadingFallback />}>
        <Header />
      </Suspense>
      <TableSection>
        <Suspense fallback={<LoadingFallback />}>
          <TableSelector />
        </Suspense>
      </TableSection>
    </DashboardContainer>
  );
};

Dashboard.propTypes = {};