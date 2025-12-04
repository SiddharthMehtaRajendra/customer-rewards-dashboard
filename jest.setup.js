const matchMediaPolyfill = query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});
global.matchMedia = jest.fn().mockImplementation(matchMediaPolyfill);

module.exports = { matchMediaPolyfill };
