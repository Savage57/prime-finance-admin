module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx)',
    '<rootDir>/src/**/?(*.)(spec|test).(ts|tsx)',
  ],
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/main.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};