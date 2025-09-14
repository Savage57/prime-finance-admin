import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../components/Button';

describe('Button Component', () => {
  test('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-brand-600');
  });

  test('renders with different variants', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-brand-600');
  });

  test('shows loading state', () => {
    render(<Button isLoading>Loading Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByRole('button')).toContainHTML('svg');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});