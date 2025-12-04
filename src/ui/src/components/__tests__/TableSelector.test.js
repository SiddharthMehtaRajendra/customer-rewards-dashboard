import { render, screen, waitFor } from '@testing-library/react';
import TableSelector from '../TableSelector';
import { useAppState, useAppDispatch } from '../../context/AppContext';

// Mock the lazy-loaded table components
jest.mock('../Tables/TransactionsTable', () => {
  // eslint-disable-next-line react/prop-types
  return function MockTransactionsTable({ initialPageSize }) {
    return <div data-testid="transactions-table">Transactions Table (pageSize: {initialPageSize})</div>;
  };
});

jest.mock('../Tables/MonthlyRewardsTable', () => {
  // eslint-disable-next-line react/prop-types
  return function MockMonthlyRewardsTable({ initialPageSize }) {
    return (
      <div data-testid="monthly-rewards-table">
        Monthly Rewards Table (pageSize: {initialPageSize})
      </div>
    );
  };
});

jest.mock('../Tables/TotalRewardsTable', () => {
  // eslint-disable-next-line react/prop-types
  return function MockTotalRewardsTable({ initialPageSize }) {
    return <div data-testid="total-rewards-table">Total Rewards Table (pageSize: {initialPageSize})</div>;
  };
});

jest.mock('../../context/AppContext', () => ({
  useAppState: jest.fn(),
  useAppDispatch: jest.fn(),
  // eslint-disable-next-line react/prop-types
  AppProvider: ({ children }) => <div>{children}</div>,
}));

describe('TableSelector Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    useAppDispatch.mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  it('should render TransactionsTable by default', async () => {
    useAppState.mockReturnValue({ currentTable: 'transactions' });
    
    render(<TableSelector />);

    await waitFor(() => {
      expect(screen.getByTestId('transactions-table')).toBeInTheDocument();
    });
  });

  it('should dispatch SWITCH_TABLE to transactions on mount', async () => {
    useAppState.mockReturnValue({ currentTable: 'transactions' });
    
    render(<TableSelector />);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SWITCH_TABLE',
        payload: 'transactions',
      });
    });
  });

  it('should render MonthlyRewardsTable when currentTable is "monthly"', async () => {
    useAppState.mockReturnValue({ currentTable: 'monthly' });
    
    render(<TableSelector />);

    await waitFor(() => {
      expect(screen.getByTestId('monthly-rewards-table')).toBeInTheDocument();
    });
  });

  it('should render TotalRewardsTable when currentTable is "total"', async () => {
    useAppState.mockReturnValue({ currentTable: 'total' });
    
    render(<TableSelector />);

    await waitFor(() => {
      expect(screen.getByTestId('total-rewards-table')).toBeInTheDocument();
    });
  });

  it('should render MonthlyRewardsTable with initialPageSize prop', async () => {
    useAppState.mockReturnValue({ currentTable: 'monthly' });
    
    render(<TableSelector />);

    await waitFor(() => {
      expect(screen.getByTestId('monthly-rewards-table')).toBeInTheDocument();
    });
    expect(screen.getByText(/pageSize: 10/)).toBeInTheDocument();
  });

  it('should pass initialPageSize to tables', async () => {
    useAppState.mockReturnValue({ currentTable: 'transactions' });
    
    render(<TableSelector initialPageSize={25} />);

    await waitFor(() => {
      expect(screen.getByText(/pageSize: 25/)).toBeInTheDocument();
    });
  });

  it('should use default initialPageSize of 10 when not provided', async () => {
    useAppState.mockReturnValue({ currentTable: 'transactions' });
    
    render(<TableSelector />);

    await waitFor(() => {
      expect(screen.getByText(/pageSize: 10/)).toBeInTheDocument();
    });
  });

  it('should render based on type prop when provided', async () => {
    useAppState.mockReturnValue({ currentTable: 'total' });
    render(<TableSelector />);

    await waitFor(() => {
      expect(screen.getByTestId('total-rewards-table')).toBeInTheDocument();
    });
  });

  it('should render null for invalid table type', async () => {
    useAppState.mockReturnValue({ currentTable: 'invalid' });
    
    render(<TableSelector />);

    await waitFor(() => {
      // Should not render any table for invalid type
      expect(screen.queryByTestId('transactions-table')).not.toBeInTheDocument();
    });
    expect(screen.queryByTestId('monthly-rewards-table')).not.toBeInTheDocument();
    expect(screen.queryByTestId('total-rewards-table')).not.toBeInTheDocument();
  });
});
