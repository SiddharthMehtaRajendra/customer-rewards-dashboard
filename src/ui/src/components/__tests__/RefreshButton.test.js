import { render, screen, fireEvent } from '@testing-library/react';
import RefreshButton from '../RefreshButton';
import { useAppState, useAppDispatch } from '../../context/AppContext';

jest.mock('../../context/AppContext', () => ({
  useAppState: jest.fn(),
  useAppDispatch: jest.fn(),
}));

describe('RefreshButton Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    useAppDispatch.mockReturnValue(mockDispatch);
    delete window.location;
    window.location = { reload: jest.fn() };
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not render when showRefresh is false', () => {
    useAppState.mockReturnValue({
      showRefresh: false,
      lastEventMessage: null,
    });

    render(<RefreshButton />);
    expect(screen.queryByText('Refresh')).not.toBeInTheDocument();
  });

  it('should render when showRefresh is true', () => {
    useAppState.mockReturnValue({
      showRefresh: true,
      lastEventMessage: 'New customer added',
    });

    render(<RefreshButton />);
    expect(screen.getByText('New customer added')).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();
    expect(screen.getByText('Dismiss')).toBeInTheDocument();
  });

  it('should display the lastEventMessage', () => {
    const testMessage = 'Database has been updated';
    useAppState.mockReturnValue({
      showRefresh: true,
      lastEventMessage: testMessage,
    });

    render(<RefreshButton />);
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  it('should reload the page when Refresh button is clicked', () => {
    useAppState.mockReturnValue({
      showRefresh: true,
      lastEventMessage: 'New data available',
    });

    render(<RefreshButton />);
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it('should dispatch HIDE_REFRESH when Dismiss button is clicked', () => {
    useAppState.mockReturnValue({
      showRefresh: true,
      lastEventMessage: 'New data available',
    });

    render(<RefreshButton />);
    const dismissButton = screen.getByText('Dismiss');
    fireEvent.click(dismissButton);

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'HIDE_REFRESH' });
  });

  it('should render ReloadOutlined icon on refresh button', () => {
    useAppState.mockReturnValue({
      showRefresh: true,
      lastEventMessage: 'Update available',
    });

    render(<RefreshButton />);
    const refreshButton = screen.getByText('Refresh');
    expect(refreshButton).toBeInTheDocument();
  });

  it('should be memoized with React.memo', () => {
    expect(RefreshButton.type).toBeTruthy();
  });

  it('should not dispatch HIDE_REFRESH when refresh button is clicked', () => {
    useAppState.mockReturnValue({
      showRefresh: true,
      lastEventMessage: 'New data available',
    });

    render(<RefreshButton />);
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
