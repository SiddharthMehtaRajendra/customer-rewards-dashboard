import { render, screen, waitFor } from '@testing-library/react';
import { Dashboard } from '../Dashboard';

jest.mock('../Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('../TableSelector', () => {
  // eslint-disable-next-line react/prop-types
  return function MockTableSelector({ initialPageSize }) {
    return <div data-testid="table-selector">Table Selector (pageSize: {initialPageSize || 10})</div>;
  };
});

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the dashboard title', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Customer Rewards Dashboard')).toBeInTheDocument();
    });
  });
  
  it('should render Header component within Suspense', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });
  });

  it('should render TableSelector component', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByTestId('table-selector')).toBeInTheDocument();
    });
  });
});
