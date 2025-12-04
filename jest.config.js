module.exports = {
  testEnvironment: '<rootDir>/jest-environment-jsdom-with-polyfills.js',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(axios)/)',
  ],
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/utils/',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};
