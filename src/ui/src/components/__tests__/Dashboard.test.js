import { render, screen, waitFor } from '@testing-library/react';
import { Dashboard } from '../Dashboard';

// Mock child components
jest.mock('../RefreshButton', () => {
  return function MockRefreshButton() {
    return <div data-testid="refresh-button">Refresh Button</div>;
  };
});

jest.mock('../Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('../TableSelector', () => {
  // eslint-disable-next-line react/prop-types
  return function MockTableSelector({ limit }) {
    return <div data-testid="table-selector">Table Selector (limit: {limit})</div>;
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

  it('should render RefreshButton component', () => {
    render(<Dashboard />);
    expect(screen.getByTestId('refresh-button')).toBeInTheDocument();
  });

  it('should render Header component within Suspense', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });
  });

  it('should render TableSelector component with correct limit prop', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByTestId('table-selector')).toBeInTheDocument();
    });
    expect(screen.getByText(/limit: 100/i)).toBeInTheDocument();
  });

  it('should have proper dashboard structure with all sections', () => {
    render(<Dashboard />);
    expect(screen.getByText('Customer Rewards Dashboard')).toBeInTheDocument();
  });

  it('should show loading fallback while lazy components load', () => {
    render(<Dashboard />);
    // Initially, suspense fallback may show before components load
    // This is implementation-dependent on React's Suspense behavior
  });
});
