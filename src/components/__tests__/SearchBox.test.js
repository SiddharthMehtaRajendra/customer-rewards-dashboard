import { render, screen, fireEvent } from '@testing-library/react';
import SearchBox from '../SearchBox';

jest.useFakeTimers();

describe('SearchBox Component', () => {
  let mockOnSearchChange;

  beforeEach(() => {
    mockOnSearchChange = jest.fn();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should render the search input', () => {
    render(<SearchBox searchValue="" onSearchChange={mockOnSearchChange} />);
    
    const input = screen.getByPlaceholderText('Search by customer name...');
    expect(input).toBeInTheDocument();
  });

  it('should display the searchValue prop', () => {
    render(<SearchBox searchValue="John Doe" onSearchChange={mockOnSearchChange} />);
    
    const input = screen.getByPlaceholderText('Search by customer name...');
    expect(input).toHaveValue('John Doe');
  });

  it('should call onSearchChange immediately with shouldCallApi=false when typing', () => {
    render(<SearchBox searchValue="" onSearchChange={mockOnSearchChange} />);
    
    const input = screen.getByPlaceholderText('Search by customer name...');
    fireEvent.change(input, { target: { value: 'Jane' } });

    expect(mockOnSearchChange).toHaveBeenCalledWith('Jane', false);
  });

  it('should debounce API calls and call onSearchChange with shouldCallApi=true after 500ms', () => {
    render(<SearchBox searchValue="" onSearchChange={mockOnSearchChange} />);
    
    const input = screen.getByPlaceholderText('Search by customer name...');
    fireEvent.change(input, { target: { value: 'Jane' } });

    // Initial call with false
    expect(mockOnSearchChange).toHaveBeenCalledWith('Jane', false);

    // Fast-forward time by 500ms
    jest.advanceTimersByTime(500);

    // Should now have been called with true
    expect(mockOnSearchChange).toHaveBeenCalledWith('Jane', true);
  });

  it('should cancel previous debounce timer when typing quickly', () => {
    render(<SearchBox searchValue="" onSearchChange={mockOnSearchChange} />);
    
    const input = screen.getByPlaceholderText('Search by customer name...');
    
    // Type 'J'
    fireEvent.change(input, { target: { value: 'J' } });
    jest.advanceTimersByTime(200);
    
    // Type 'Ja' before debounce completes
    fireEvent.change(input, { target: { value: 'Ja' } });
    jest.advanceTimersByTime(200);
    
    // Type 'Jan' before debounce completes
    fireEvent.change(input, { target: { value: 'Jan' } });
    
    // Only immediate calls should have happened
    expect(mockOnSearchChange).toHaveBeenCalledTimes(3);
    expect(mockOnSearchChange).toHaveBeenNthCalledWith(1, 'J', false);
    expect(mockOnSearchChange).toHaveBeenNthCalledWith(2, 'Ja', false);
    expect(mockOnSearchChange).toHaveBeenNthCalledWith(3, 'Jan', false);
    
    // Complete the debounce
    jest.advanceTimersByTime(500);
    
    // Now should have the debounced call
    expect(mockOnSearchChange).toHaveBeenCalledWith('Jan', true);
  });

  it('should cleanup debounce timer on unmount', () => {
    const { unmount } = render(
      <SearchBox searchValue="" onSearchChange={mockOnSearchChange} />,
    );
    
    const input = screen.getByPlaceholderText('Search by customer name...');
    fireEvent.change(input, { target: { value: 'Test' } });
    
    unmount();
    
    // Advance timers - should not call the debounced function after unmount
    jest.advanceTimersByTime(500);
  });
  
  it('should handle empty string input', () => {
    render(<SearchBox searchValue="test" onSearchChange={mockOnSearchChange} />);
    
    const input = screen.getByPlaceholderText('Search by customer name...');
    fireEvent.change(input, { target: { value: '' } });

    expect(mockOnSearchChange).toHaveBeenCalledWith('', false);
    
    jest.advanceTimersByTime(500);
    expect(mockOnSearchChange).toHaveBeenCalledWith('', true);
  });

  it('should accept searchValue prop changes', () => {
    const { rerender } = render(
      <SearchBox searchValue="initial" onSearchChange={mockOnSearchChange} />,
    );
    
    let input = screen.getByPlaceholderText('Search by customer name...');
    expect(input).toHaveValue('initial');
    
    rerender(<SearchBox searchValue="updated" onSearchChange={mockOnSearchChange} />);
    
    input = screen.getByPlaceholderText('Search by customer name...');
    expect(input).toHaveValue('updated');
  });
});
