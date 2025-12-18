module.exports = {
  // Test environment
  testEnvironment: 'jsdom',

  // Roots to search for tests
  roots: ['<rootDir>/src', '<rootDir>/examples'],

  // Override testMatch to include examples directory
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
    '<rootDir>/examples/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/examples/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],

  // Collect coverage from examples directory
  collectCoverageFrom: [
    'examples/**/*.{ts,tsx}',
    '!examples/**/*.d.ts',
    '!examples/**/index.ts',
    '!examples/**/*.test.{ts,tsx}',
    '!examples/**/*.spec.{ts,tsx}'
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
