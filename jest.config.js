module.exports = {
  // Test environment
  testEnvironment: 'jsdom',

  // Roots to search for tests
  roots: ['<rootDir>/src', '<rootDir>/example'],

  // Override testMatch to include example directory
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
    '<rootDir>/example/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/example/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],

  // Collect coverage from example directory
  collectCoverageFrom: [
    'example/**/*.{ts,tsx}',
    '!example/**/*.d.ts',
    '!example/**/index.ts',
    '!example/**/*.test.{ts,tsx}',
    '!example/**/*.spec.{ts,tsx}'
  ],

  // Coverage reporters including json-summary
  coverageReporters: [
    'json',
    'json-summary',
    'lcov',
    'text',
    'clover'
  ],

  // Transform TypeScript files
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/react-scripts/config/jest/babelTransform.js',
    '^.+\\.css$': '<rootDir>/node_modules/react-scripts/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/node_modules/react-scripts/config/jest/fileTransform.js'
  },

  // Module name mapper for CSS modules
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // Test environment
  testEnvironment: 'jsdom'
};
