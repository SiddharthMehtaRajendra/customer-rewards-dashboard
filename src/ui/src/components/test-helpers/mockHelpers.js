import { mockTransactions, mockMonthlyRewards, mockTotalRewards, createMockPaginatedResponse } from './testUtils';

/**
 * Mock API service functions
 */
export const createMockApiService = () => ({
  fetchTransactions: jest.fn(() => 
    Promise.resolve(createMockPaginatedResponse(mockTransactions)),
  ),
  fetchRewardsMonthly: jest.fn(() => 
    Promise.resolve(createMockPaginatedResponse(mockMonthlyRewards)),
  ),
  fetchRewardsTotal: jest.fn(() => 
    Promise.resolve(createMockPaginatedResponse(mockTotalRewards)),
  ),
});

/**
 * Mock CSV export utilities
 */
export const mockCsvExport = {
  exportTableToCSV: jest.fn(),
  convertToCSV: jest.fn(() => 'mock,csv,data'),
  downloadCSV: jest.fn(),
};

/**
 * Mock socket.io-client
 */
export const mockSocket = {
  on: jest.fn(),
  emit: jest.fn(),
  disconnect: jest.fn(),
  connect: jest.fn(),
};

export const mockSocketIO = jest.fn(() => mockSocket);
