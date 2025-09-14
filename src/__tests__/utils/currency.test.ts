import { formatCurrency, parseCurrency } from '../../utils/currency';

describe('Currency Utilities', () => {
  describe('formatCurrency', () => {
    test('formats Nigerian Naira correctly', () => {
      expect(formatCurrency(1000)).toBe('₦1,000');
      expect(formatCurrency(1000000)).toBe('₦1,000,000');
      expect(formatCurrency(0)).toBe('₦0');
    });

    test('handles decimal places', () => {
      expect(formatCurrency(1000.50)).toBe('₦1,001'); // Rounded
      expect(formatCurrency(1000.50, true)).toBe('₦1,000.50'); // With decimals
    });

    test('handles negative amounts', () => {
      expect(formatCurrency(-1000)).toBe('-₦1,000');
    });
  });

  describe('parseCurrency', () => {
    test('parses formatted currency strings', () => {
      expect(parseCurrency('₦1,000')).toBe(1000);
      expect(parseCurrency('₦1,000,000')).toBe(1000000);
      expect(parseCurrency('1000')).toBe(1000);
    });

    test('handles invalid inputs', () => {
      expect(parseCurrency('')).toBe(0);
      expect(parseCurrency('invalid')).toBe(0);
      expect(parseCurrency(null as any)).toBe(0);
    });
  });
});