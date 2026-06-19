module.exports = {
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.+(js|ts|jsx|tsx)',
    '**/?(*.)+(spec|test).+(js|ts|jsx|tsx)'
  ],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/**/*.test.js',
    '!node_modules/'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};