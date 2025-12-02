import { render } from '@testing-library/react';
import { AppProvider } from '../../context/AppContext';

/**
 * Custom render function that wraps components with AppProvider
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Additional render options
 * @returns {Object} RTL render result
 */
export const renderWithContext = (ui, options = {}) => {
  // eslint-disable-next-line react/prop-types
  const Wrapper = ({ children }) => (
    <AppProvider>
      {children}
    </AppProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

/**
 * Mock data for transactions
 */
export const mockTransactions = [
  {
    key: '1',
    transactionId: 'TXN001',
    customerId: 'CUST001',
    customerName: 'John Doe',
    purchaseDate: '2023-01-15',
    product: 'Laptop',
    price: 1200,
    points: 2350,
  },
  {
    key: '2',
    transactionId: 'TXN002',
    customerId: 'CUST002',
    customerName: 'Jane Smith',
    purchaseDate: '2023-02-20',
    product: 'Phone',
    price: 800,
    points: 1550,
  },
  {
    key: '3',
    transactionId: 'TXN003',
    customerId: 'CUST003',
    customerName: 'Bob Johnson',
    purchaseDate: '2023-03-10',
    product: 'Tablet',
    price: 500,
    points: 950,
  },
];

/**
 * Mock data for monthly rewards
 */
export const mockMonthlyRewards = [
  {
    key: '1',
    customerId: 'CUST001',
    customerName: 'John Doe',
    month: '1',
    year: '2023',
    points: 2350,
  },
  {
    key: '2',
    customerId: 'CUST002',
    customerName: 'Jane Smith',
    month: '2',
    year: '2023',
    points: 1550,
  },
];

/**
 * Mock data for total rewards
 */
export const mockTotalRewards = [
  {
    key: '1',
    customerId: 'CUST001',
    customerName: 'John Doe',
    totalPoints: 4500,
  },
  {
    key: '2',
    customerId: 'CUST002',
    customerName: 'Jane Smith',
    totalPoints: 3200,
  },
];

/**
 * Create a mock paginated API response
 */
export const createMockPaginatedResponse = (data, page = 1, pageSize = 10, total = null) => ({
  data: data,
  total: total || data.length,
  page,
  pageSize,
});

/**
 * Mock window.location.reload
 */
export const mockWindowReload = () => {
  delete window.location;
  window.location = { reload: jest.fn() };
};

/**
 * Wait for async updates
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));
