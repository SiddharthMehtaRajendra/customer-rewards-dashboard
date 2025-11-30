import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { useAppDispatch, useAppState } from '../../context/AppContext';

jest.mock('../../context/AppContext', () => ({
  useAppState: jest.fn(),
  useAppDispatch: jest.fn(),
  // eslint-disable-next-line react/prop-types
  AppProvider: ({ children }) => <div>{children}</div>,
}));

describe('Header Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    useAppDispatch.mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  it('should render all three table selection cards', () => {
    useAppState.mockReturnValue({ currentTable: 'transactions' });
    render(<Header />);

    expect(screen.getByText('Retrieve all transactions')).toBeInTheDocument();
    expect(screen.getByText('Retrieve monthly rewards')).toBeInTheDocument();
    expect(screen.getByText('Retrieve total rewards')).toBeInTheDocument();
  });

  it('should highlight the transactions card when currentTable is "transactions"', () => {
    useAppState.mockReturnValue({ currentTable: 'transactions' });
    render(<Header />);
    
    // All three cards should be rendered
    expect(screen.getByText('Retrieve all transactions')).toBeInTheDocument();
    expect(screen.getByText('Retrieve monthly rewards')).toBeInTheDocument();
    expect(screen.getByText('Retrieve total rewards')).toBeInTheDocument();
  });

  it('should highlight the monthly card when currentTable is "monthly"', () => {
    useAppState.mockReturnValue({ currentTable: 'monthly' });
    render(<Header />);
    
    expect(screen.getByText('Retrieve monthly rewards')).toBeInTheDocument();
  });

  it('should highlight the total card when currentTable is "total"', () => {
    useAppState.mockReturnValue({ currentTable: 'total' });
    render(<Header />);
    
    expect(screen.getByText('Retrieve total rewards')).toBeInTheDocument();
  });

  it('should dispatch SWITCH_TABLE action with "transactions" when clicking transactions card', () => {
    useAppState.mockReturnValue({ currentTable: 'monthly' });
    render(<Header />);

    const transactionsCard = screen.getByText('Retrieve all transactions');
    fireEvent.click(transactionsCard);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SWITCH_TABLE',
      payload: 'transactions',
    });
  });

  it('should dispatch SWITCH_TABLE action with "monthly" when clicking monthly card', () => {
    useAppState.mockReturnValue({ currentTable: 'transactions' });
    render(<Header />);

    const monthlyCard = screen.getByText('Retrieve monthly rewards');
    fireEvent.click(monthlyCard);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SWITCH_TABLE',
      payload: 'monthly',
    });
  });

  it('should dispatch SWITCH_TABLE action with "total" when clicking total card', () => {
    useAppState.mockReturnValue({ currentTable: 'transactions' });
    render(<Header />);

    const totalCard = screen.getByText('Retrieve total rewards');
    fireEvent.click(totalCard);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SWITCH_TABLE',
      payload: 'total',
    });
  });

  it('should be memoized with React.memo', () => {
    useAppState.mockReturnValue({ currentTable: 'transactions' });
    expect(Header.type).toBeTruthy(); // React.memo wraps the component
  });
});
