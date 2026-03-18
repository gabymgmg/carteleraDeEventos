import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import EditEvent from './EditEvent';
import api from '../api/axios';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('EditEvent Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should load data and call api.put', async () => {
    const mockData = {
      title: 'Evento Original',
      location: 'Sede A',
      date: '2026-05-20T10:00',
      description: 'Esta es una descripción válida para el test',
      category: 'Concierto',
    };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });
    const mockedPut = vi.mocked(api.put).mockResolvedValue({ data: {} });

    render(
      <MemoryRouter initialEntries={['/events/edit/123']}>
        <Routes>
          <Route path="/events/edit/:id" element={<EditEvent />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for loading
    await waitFor(() => {
      expect(screen.getByLabelText(/Título/i)).toHaveValue('Evento Original');
    });

    // Edit title
    const titleInput = screen.getByLabelText(/Título/i);
    fireEvent.change(titleInput, { target: { value: 'Evento Actualizado' } });

    const file = new File(['hello'], 'test.png', { type: 'image/png' });
    const imageInput = screen.getByLabelText(/Imagen del Evento/i);
    fireEvent.change(imageInput, { target: { files: [file] } });

    const submitButton = screen.getByRole('button', {
      name: /Guardar Cambios/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const sentFormData = vi.mocked(api.put).mock.calls[0][1] as FormData;
      expect(sentFormData.get('title')).toBe('Evento Actualizado');
      expect(mockedPut).toHaveBeenCalledWith(
        '/events/123',
        expect.any(FormData)
      );
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
