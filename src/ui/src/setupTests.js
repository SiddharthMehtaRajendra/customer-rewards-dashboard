/* eslint-disable no-console */
import '@testing-library/jest-dom';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

if (typeof global !== 'undefined') {
  global.React_StrictMode_shouldDoubleInvokeInDEV = false;
}

global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
  }
  unobserve() {
  }
  disconnect() {
  }
};

window.matchMedia = window.matchMedia || function(query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

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
