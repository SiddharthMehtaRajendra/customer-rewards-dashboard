// This file runs BEFORE the test environment is set up
// NOTE: At this point, the DOM (window) doesn't exist yet, so we polyfill on global

// Define matchMedia polyfill
const matchMediaPolyfill = query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(), // deprecated
  removeListener: jest.fn(), // deprecated
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

// Polyfill on global for Node environment
global.matchMedia = jest.fn().mockImplementation(matchMediaPolyfill);

// Export for use in custom test environment
module.exports = { matchMediaPolyfill };
