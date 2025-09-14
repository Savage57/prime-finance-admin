import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoanCalculator } from '../../components/LoanCalculator';

describe('LoanCalculator Component', () => {
  test('renders with default values', () => {
    render(<LoanCalculator />);
    
    expect(screen.getByText(/loan calculator/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('12')).toBeInTheDocument(); // Default term
    expect(screen.getByText(/apply for loan/i)).toBeInTheDocument();
  });

  test('updates amount when slider changes', () => {
    render(<LoanCalculator />);
    const slider = screen.getByRole('slider');
    
    fireEvent.change(slider, { target: { value: '100000' } });
    // Note: The actual display value would be animated, so we test the slider value
    expect(slider).toHaveValue('100000');
  });

  test('quick select buttons work', () => {
    render(<LoanCalculator />);
    const quickButton = screen.getByText('₦50k');
    
    fireEvent.click(quickButton);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue('50000');
  });

  test('term selection updates monthly payment', () => {
    render(<LoanCalculator />);
    const termSelect = screen.getByDisplayValue('12');
    
    fireEvent.change(termSelect, { target: { value: '24' } });
    expect(termSelect).toHaveValue('24');
    
    // Monthly payment should be displayed
    expect(screen.getByText(/monthly payment/i)).toBeInTheDocument();
  });

  test('calls onApply when apply button is clicked', () => {
    const mockOnApply = jest.fn();
    render(<LoanCalculator onApply={mockOnApply} />);
    
    const applyButton = screen.getByText(/apply for loan/i);
    fireEvent.click(applyButton);
    
    expect(mockOnApply).toHaveBeenCalledWith(50000, 12); // Default values
  });

  test('displays correct interest rate', () => {
    render(<LoanCalculator />);
    expect(screen.getByText('18% per annum')).toBeInTheDocument();
  });
});