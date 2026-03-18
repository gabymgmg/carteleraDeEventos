import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CreateEvent from './CreateEvent';
import api from '../api/axios';

// Mock de la navegación
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as any;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CreateEvent Page', () => {
  it('should call api.post and redirect to dashboard when form is submitted', async () => {
    const mockedPost = vi.mocked(api.post).mockResolvedValue({ data: {} });

    render(
      <MemoryRouter>
        <CreateEvent />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Título/i), {
      target: { value: 'Evento' },
    });
    fireEvent.change(screen.getByLabelText(/Fecha/i), {
      target: { value: '2026-05-20' },
    });
    fireEvent.change(screen.getByLabelText(/Ubicación/i), {
      target: { value: 'Lugar' },
    });
    fireEvent.change(screen.getByLabelText(/Descripción/i), {
      target: { value: 'Desc' },
    });

    const file = new File(['hello'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/Imagen del Evento/i), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByRole('button', { name: /Crear Evento/i }));

    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledWith('/events', expect.any(FormData));
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
