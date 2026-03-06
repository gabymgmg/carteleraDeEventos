
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Buttons'; 

describe('Button Component', () => {
  it('should render the button with the correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should show loading state when isLoading prop is true', () => {
    // Testing if button shows spinner and text accordingly
    render(<Button isLoading={true}>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should call onClick function when clicked', () => {
    const handleClick = vi.fn(); // Spy fn
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByText('Click me');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});