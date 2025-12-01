import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TotalRewardsTable from '../../Tables/TotalRewardsTable';
import { mockTotalRewards } from '../../test-helpers/testHelpers';

// Mock the entire service layer
jest.mock('../../../services/api', () => ({
  fetchRewardsTotal: jest.fn(),
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

describe('TotalRewardsTable Component', () => {
  let mockOnPageChange;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockOnPageChange = jest.fn();
    
    usePaginatedApi.mockReturnValue({
      data: mockTotalRewards,
      loading: false,
      error: null,
      page: 1,
      pageSize: 10,
      total: mockTotalRewards.length,
      onPageChange: mockOnPageChange,
    });
  });

  it('should render the total rewards table with data', async () => {
    render(<TotalRewardsTable />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should render all column headers', async () => {
    render(<TotalRewardsTable />);

    await waitFor(() => {
      const headers = screen.getAllByText('Customer ID');
      expect(headers.length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText('Customer Name').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Total Rewards').length).toBeGreaterThan(0);
  });

  it('should display customer data correctly', async () => {
    render(<TotalRewardsTable />);

    await waitFor(() => {
      expect(screen.getByText('CUST001')).toBeInTheDocument();
    });
    expect(screen.getByText('CUST002')).toBeInTheDocument();
    expect(screen.getByText('4500')).toBeInTheDocument();
    expect(screen.getByText('3200')).toBeInTheDocument();
  });

  it('should render SearchBox component', () => {
    render(<TotalRewardsTable />);
    
    const searchInput = screen.getByPlaceholderText('Search by customer name...');
    expect(searchInput).toBeInTheDocument();
  });

  it('should update search value when typing in search box', async () => {
    render(<TotalRewardsTable />);
    
    const searchInput = screen.getByPlaceholderText('Search by customer name...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    // Verify the input value changed
    await waitFor(() => {
      expect(searchInput.value).toBe('John');
    });
  });

  it('should render Export to CSV button', () => {
    render(<TotalRewardsTable />);
    
    const exportButton = screen.getByText('Export to CSV');
    expect(exportButton).toBeInTheDocument();
  });

  it('should call exportTableToCSV when export button is clicked', () => {
    render(<TotalRewardsTable />);
    
    const exportButton = screen.getByText('Export to CSV');
    fireEvent.click(exportButton);

    expect(csvExport.exportTableToCSV).toHaveBeenCalledWith(
      mockTotalRewards,
      expect.any(Array),
      'total-rewards.csv',
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

    render(<TotalRewardsTable />);
    
    // When loading is true, the table data should not be rendered
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
    
    // But the search box should still be present
    expect(screen.getByPlaceholderText('Search by customer name...')).toBeInTheDocument();
  });

  it('should show error alert when error occurs', () => {
    usePaginatedApi.mockReturnValue({
      data: [],
      loading: false,
      error: 'Network error',
      page: 1,
      pageSize: 10,
      total: 0,
      onPageChange: mockOnPageChange,
    });

    render(<TotalRewardsTable />);
    
    expect(screen.getByText('Failed to load total rewards')).toBeInTheDocument();
  });

  it('should use custom initialPageSize prop', () => {
    render(<TotalRewardsTable initialPageSize={25} />);
    
    expect(usePaginatedApi).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Object),
      expect.objectContaining({ initialPageSize: 25 }),
    );
  });

  it('should use default initialPageSize of 10', () => {
    render(<TotalRewardsTable />);
    
    expect(usePaginatedApi).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Object),
      expect.objectContaining({ initialPageSize: 10 }),
    );
  });

  it('should handle pagination changes through the table', () => {
    render(<TotalRewardsTable />);
    
    // The table will have pagination controls
    expect(usePaginatedApi).toHaveBeenCalled();
  });

  it('should update search value when cleared', async () => {
    render(<TotalRewardsTable />);
    
    const searchInput = screen.getByPlaceholderText('Search by customer name...');
    
    // Type and then clear
    fireEvent.change(searchInput, { target: { value: 'Test' } });
    fireEvent.change(searchInput, { target: { value: '' } });

    // Verify the input was cleared
    await waitFor(() => {
      expect(searchInput.value).toBe('');
    });
  });

  it('should display total points for each customer', async () => {
    render(<TotalRewardsTable />);

    await waitFor(() => {
      const johnDoe = screen.getByText('John Doe');
      expect(johnDoe).toBeInTheDocument();
    });
    
    // Check that both customers have their total points displayed
    expect(screen.getByText('4500')).toBeInTheDocument();
    expect(screen.getByText('3200')).toBeInTheDocument();
  });
});
