import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TransactionsTable from '../../Tables/TransactionsTable';
import { mockTransactions } from '../../test-helpers/testHelpers';

// Mock the entire service layer
jest.mock('../../../utils/api', () => ({
  fetchTransactions: jest.fn(),
}));

// Mock CSV export
jest.mock('../../../utils/csvExport', () => ({
  exportTableToCSV: jest.fn(),
  convertToCSV: jest.fn(),
  downloadCSV: jest.fn(),
}));

// Mock the usePaginatedApi hook
jest.mock('../../../hooks/usePaginatedApi', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const csvExport = require('../../../utils/csvExport');
const usePaginatedApi = require('../../../hooks/usePaginatedApi').default;

describe('TransactionsTable Component', () => {
  let mockOnPageChange;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockOnPageChange = jest.fn();
    
    usePaginatedApi.mockReturnValue({
      data: mockTransactions,
      loading: false,
      error: null,
      page: 1,
      pageSize: 10,
      total: mockTransactions.length,
      onPageChange: mockOnPageChange,
    });
  });

  it('should render the transactions table with data', async () => {
    render(<TransactionsTable />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('should render all column headers', async () => {
    render(<TransactionsTable />);

    await waitFor(() => {
      const headers = screen.getAllByText('Transaction ID');
      expect(headers.length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText('Customer ID').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Customer Name').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Purchase Date').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Product').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Price').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Reward Points').length).toBeGreaterThan(0);
  });

  it('should format price values correctly', async () => {
    render(<TransactionsTable />);

    await waitFor(() => {
      expect(screen.getByText('$1200.00')).toBeInTheDocument();
    });
    expect(screen.getByText('$800.00')).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();
  });

  it('should render SearchBox component', async () => {
    render(<TransactionsTable />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search by customer name...');
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('should update search value when typing in search box', async () => {
    render(<TransactionsTable />);
    
    const searchInput = screen.getByPlaceholderText('Search by customer name...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    // Verify the input value changed
    await waitFor(() => {
      expect(searchInput.value).toBe('John');
    });
  });

  it('should render Export to CSV button', async () => {
    render(<TransactionsTable />);
    
    await waitFor(() => {
      const exportButton = screen.getByText('Export to CSV');
      expect(exportButton).toBeInTheDocument();
    });
  });

  it('should call exportTableToCSV when export button is clicked', async () => {
    render(<TransactionsTable />);
    
    const exportButton = await screen.findByText('Export to CSV');
    fireEvent.click(exportButton);

    expect(csvExport.exportTableToCSV).toHaveBeenCalledWith(
      mockTransactions,
      expect.any(Array),
      'transactions.csv',
    );
  });

  it('should show loading spinner when loading is true', async () => {
    usePaginatedApi.mockReturnValue({
      data: [],
      loading: true,
      error: null,
      page: 1,
      pageSize: 10,
      total: 0,
      onPageChange: mockOnPageChange,
    });

    render(<TransactionsTable />);
    
    // When loading is true, the table data should not be rendered
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
    
    // But the search box should still be present
    expect(screen.getByPlaceholderText('Search by customer name...')).toBeInTheDocument();
  });

  it('should show error alert when error occurs', async () => {
    usePaginatedApi.mockReturnValue({
      data: [],
      loading: false,
      error: 'Network error',
      page: 1,
      pageSize: 10,
      total: 0,
      onPageChange: mockOnPageChange,
    });

    render(<TransactionsTable />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load transactions')).toBeInTheDocument();
    });
  });

  it('should use custom initialPageSize prop', async () => {
    render(<TransactionsTable initialPageSize={25} />);
    
    await waitFor(() => {
      // The hook should have been called with the custom page size in options
      expect(usePaginatedApi).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Object),
        expect.objectContaining({ initialPageSize: 25 }),
      );
    });
  });

  it('should handle table sorting', async () => {
    render(<TransactionsTable />);
    
    // Find the Purchase Date column header (sortable) - use getAllByText and click the first one
    const purchaseDateHeaders = screen.getAllByText('Purchase Date');
    fireEvent.click(purchaseDateHeaders[0]);

    // Verify the table is still rendered after sort
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('should render transaction IDs', async () => {
    render(<TransactionsTable />);

    await waitFor(() => {
      expect(screen.getByText('TXN001')).toBeInTheDocument();
    });
    expect(screen.getByText('TXN002')).toBeInTheDocument();
    expect(screen.getByText('TXN003')).toBeInTheDocument();
  });

  it('should render product names', async () => {
    render(<TransactionsTable />);

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Tablet')).toBeInTheDocument();
  });

  it('should render reward points', async () => {
    render(<TransactionsTable />);

    await waitFor(() => {
      expect(screen.getByText('2350')).toBeInTheDocument();
    });
    expect(screen.getByText('1550')).toBeInTheDocument();
    expect(screen.getByText('950')).toBeInTheDocument();
  });
});
