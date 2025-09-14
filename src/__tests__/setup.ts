import '@testing-library/jest-dom';

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    circle: 'circle',
  },
  AnimatePresence: ({ children }: any) => children,
  useSpring: (value: any) => ({ get: () => value }),
  useTransform: (value: any, transformer: any) => ({ get: () => transformer(value.get()) }),
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Mock crypto.randomUUID
global.crypto = {
  ...global.crypto,
  randomUUID: () => 'mock-uuid-' + Math.random().toString(36).substr(2, 9),
};