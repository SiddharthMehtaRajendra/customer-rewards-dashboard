import { render, screen } from '@testing-library/react';
import App from './App';

test('renders customer rewards dashboard', () => {
  render(<App />);
  const titleElement = screen.getByText(/Customer Rewards Dashboard/i);
  expect(titleElement).toBeInTheDocument();
});
