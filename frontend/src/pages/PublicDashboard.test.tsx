import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PublicDashboard from './PublicDashboard';
import api from '../api/axios';

describe('PublicDashboard Page', () => {
  const mockEvents = [
    {
      _id: '1',
      title: 'Concierto Rock',
      category: 'Concierto',
      location: 'Carabobo',
    },
    {
      _id: '2',
      title: 'Feria Gastronómica',
      category: 'Feria',
      location: 'Valencia',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load and show available events', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: mockEvents });

    render(
      <MemoryRouter>
        <PublicDashboard />
      </MemoryRouter>
    );

    // verify that api calls without any filters at first
    expect(api.get).toHaveBeenCalledWith(expect.stringMatching(/\/events\??/));
    // Waiting for cards to show
    const eventCards = await screen.findAllByText(/Ver Detalles/i);
    expect(eventCards).toHaveLength(2);
    expect(screen.getByText('Concierto Rock')).toBeInTheDocument();
  });

  it('should update URL and call API when filtering by category', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [mockEvents[0]] });

    render(
      <MemoryRouter>
        <PublicDashboard />
      </MemoryRouter>
    );

    const conciertoBtn = screen.getByRole('button', { name: /^Concierto$/i });
    fireEvent.click(conciertoBtn);

    // Verifying that the api gets called with concert category filter
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('category=Concierto')
      );
    });
  });

  it('should filter by text when user search', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <PublicDashboard />
      </MemoryRouter>
    );

    const searchInput = screen.getByLabelText(/¿Qué buscas?/i);
    fireEvent.change(searchInput, { target: { value: 'Jazz' } });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('search=Jazz')
      );
    });
  });

  it('should show a message if there is no result', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <PublicDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No hay eventos que coincidan con tu búsqueda/i)
      ).toBeInTheDocument();
    });
  });

  it('should clean filters when user clicks reset button', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: mockEvents });

    render(
      <MemoryRouter
        initialEntries={['/dashboard?category=Concierto&search=Jazz']}
      >
        <PublicDashboard />
      </MemoryRouter>
    );

    const clearBtn = screen.getByRole('button', { name: /Limpiar filtros/i });
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/events?');
    });
  });

 it('should handle API errors show empty state', async () => {
  vi.mocked(api.get).mockRejectedValue(new Error('Internal Server Error'));

  render(
    <MemoryRouter>
      <PublicDashboard />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/No hay eventos que coincidan con tu búsqueda/i)).toBeInTheDocument();
  });

  const eventCards = screen.queryAllByText(/Ver Detalles/i);
  expect(eventCards).toHaveLength(0);
});
});
