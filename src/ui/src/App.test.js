import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the Dashboard component to avoid socket.io-client issues
jest.mock('./components/Dashboard', () => ({
  Dashboard: () => <div>Customer Rewards Dashboard</div>,
}));

test('renders customer rewards dashboard', () => {
  render(<App />);
  const titleElement = screen.getByText(/Customer Rewards Dashboard/i);
  expect(titleElement).toBeInTheDocument();
});
