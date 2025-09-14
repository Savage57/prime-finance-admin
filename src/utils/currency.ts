export function formatCurrency(
  amount: number, 
  showDecimals: boolean = false,
  currency: string = 'NGN'
): string {
  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  return formatter.format(amount);
}

export function parseCurrency(value: string): number {
  if (!value || typeof value !== 'string') return 0;
  
  // Remove currency symbols, commas, and spaces
  const cleaned = value.replace(/[₦,\s]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
}

export function formatCompactCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `₦${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `₦${(amount / 1000).toFixed(0)}k`;
  }
  return formatCurrency(amount);
}

export function calculateLoanPayment(
  principal: number,
  annualRate: number,
  termInMonths: number
): number {
  const monthlyRate = annualRate / 12;
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, termInMonths);
  const denominator = Math.pow(1 + monthlyRate, termInMonths) - 1;
  
  return numerator / denominator;
}