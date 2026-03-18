import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from './Input';

describe('Input Component', () => {
  it('it should render label correctly', () => {
    render(
      <Input label="Nombre del Evento" name="title" onChange={() => {}} />
    );
    expect(screen.getByText('Nombre del Evento')).toBeInTheDocument();
  });

  it('it should call onChange handler when user types in the input', () => {
    const handleChange = vi.fn();
    render(<Input label="Título" name="title" onChange={handleChange} />);

    const InputElement = screen.getByLabelText('Título');
    fireEvent.change(InputElement, { target: { value: 'Concierto de Jazz' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: 'Concierto de Jazz' }),
      })
    );
  });

  it('it should show the correct values from the props', () => {
    render(
      <Input
        label="Ubicación"
        name="location"
        value="Estadio Único"
        onChange={() => {}}
      />
    );
    const InputElement = screen.getByLabelText('Ubicación') as HTMLInputElement;
    expect(InputElement.value).toBe('Estadio Único');
  });
});
