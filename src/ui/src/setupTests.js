/* eslint-disable no-console */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Suppress React 19 act warnings in tests by setting the environment flag
// eslint-disable-next-line no-undef
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Add failsafe for React 19 compatibility
// Set React's internal flag to disable strict effects in tests
if (typeof global !== 'undefined') {
  // Disable StrictMode effects that cause AggregateErrors
  global.React_StrictMode_shouldDoubleInvokeInDEV = false;
}

// Polyfill ResizeObserver for jsdom environment (needed for Ant Design components)
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    // Mock implementation - do nothing
  }
  unobserve() {
    // Mock implementation - do nothing
  }
  disconnect() {
    // Mock implementation - do nothing
  }
};

// Polyfill window.matchMedia - this runs AFTER jsdom creates the window object
window.matchMedia = window.matchMedia || function(query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

// Mock console.error to suppress React 19 warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    const message = typeof args[0] === 'string' ? args[0] : String(args[0]);
    if (
      message.includes('AggregateError') ||
      message.includes('Warning: An update to') ||
      message.includes('was not wrapped in act') ||
      message.includes('Cannot log after tests are done')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
