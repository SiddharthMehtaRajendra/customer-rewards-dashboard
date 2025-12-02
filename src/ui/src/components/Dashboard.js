import { lazy, Suspense } from 'react';
import { Spin } from 'antd';
import { DashboardContainer, DashboardTitle, TableSection, LoadingContainer } from './common/styles';

const Header = lazy(() => import('./Header'));
const TableSelector = lazy(() => import('./TableSelector'));

const LoadingFallback = () => (
  <LoadingContainer>
    <Spin tip="Loading..." />
  </LoadingContainer>
);

/**
 * This component acts as a blueprint for the app. It lazily loads individual page
 * elements such as the Header or Table, for performance.
 */
export const Dashboard = () => {
  
  return (
    <DashboardContainer>
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