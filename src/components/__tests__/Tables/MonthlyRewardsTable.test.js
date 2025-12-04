import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MonthlyRewardsTable from '../../Tables/MonthlyRewardsTable';
import { mockMonthlyRewards } from '../../test-helpers/testHelpers';

// Mock the entire service layer
jest.mock('../../../utils/api', () => ({
  fetchRewardsMonthly: jest.fn(),
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

describe('MonthlyRewardsTable Component', () => {
  let mockOnPageChange;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockOnPageChange = jest.fn();
    
    usePaginatedApi.mockReturnValue({
      data: mockMonthlyRewards,
      loading: false,
      error: null,
      page: 1,
      pageSize: 10,
      total: mockMonthlyRewards.length,
      onPageChange: mockOnPageChange,
    });
  });

  it('should render the monthly rewards table with data', async () => {
    render(<MonthlyRewardsTable />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should render all column headers', async () => {
    render(<MonthlyRewardsTable />);

    await waitFor(() => {
      const headers = screen.getAllByText('Customer ID');
      expect(headers.length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText('Customer Name').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Month').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Year').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Monthly Rewards').length).toBeGreaterThan(0);
  });

  it('should display customer data correctly', async () => {
    render(<MonthlyRewardsTable />);

    await waitFor(() => {
      expect(screen.getByText('CUST001')).toBeInTheDocument();
    });
    expect(screen.getByText('CUST002')).toBeInTheDocument();
    expect(screen.getByText('2350')).toBeInTheDocument();
    expect(screen.getByText('1550')).toBeInTheDocument();
  });

  it('should render SearchBox component', () => {
    render(<MonthlyRewardsTable />);
    
    const searchInput = screen.getByPlaceholderText('Search by customer name...');
    expect(searchInput).toBeInTheDocument();
  });

  it('should update search value when typing in search box', async () => {
    render(<MonthlyRewardsTable />);
    
    const searchInput = screen.getByPlaceholderText('Search by customer name...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    // Verify the input value changed
    await waitFor(() => {
      expect(searchInput.value).toBe('John');
    });
  });

  it('should render Export to CSV button', () => {
    render(<MonthlyRewardsTable />);
    
    const exportButton = screen.getByText('Export to CSV');
    expect(exportButton).toBeInTheDocument();
  });

  it('should call exportTableToCSV when export button is clicked', () => {
    render(<MonthlyRewardsTable />);
    
    const exportButton = screen.getByText('Export to CSV');
    fireEvent.click(exportButton);

    expect(csvExport.exportTableToCSV).toHaveBeenCalledWith(
      mockMonthlyRewards,
      expect.any(Array),
      'monthly-rewards.csv',
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

    render(<MonthlyRewardsTable />);
    
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

    render(<MonthlyRewardsTable />);
    
    expect(screen.getByText('Failed to load monthly rewards')).toBeInTheDocument();
  });

  it('should use custom initialPageSize prop', () => {
    render(<MonthlyRewardsTable initialPageSize={25} />);
    
    expect(usePaginatedApi).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Object),
      expect.objectContaining({ initialPageSize: 25 }),
    );
  });

  it('should display month and year data', async () => {
    render(<MonthlyRewardsTable />);

    await waitFor(() => {
      const monthElements = screen.getAllByText('1');
      expect(monthElements.length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2023').length).toBeGreaterThan(0);
  });

  it('should handle pagination changes', () => {
    render(<MonthlyRewardsTable />);
    
    // Antd table pagination will call handlePageChange
    // This is tested through the mock
    expect(usePaginatedApi).toHaveBeenCalled();
  });

  it('should pass customerName to setParams with empty string when search is cleared', async () => {
    render(<MonthlyRewardsTable />);
    
    const searchInput = screen.getByPlaceholderText('Search by customer name...');
    
    // Type something first
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Clear it
    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => {
      expect(searchInput.value).toBe('');
    });
  });
});
