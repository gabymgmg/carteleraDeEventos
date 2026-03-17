import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthProvider';
import OwnerDashboard from './OwnerDashboard';
import api from '../api/axios';

// Mocking the api call
vi.mock('../api/axios', () => {
  const mockApi = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  };
  return {
    default: mockApi,
    ...mockApi,
  };
});

describe('Owner Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should show a list of events when the API returns data', async () => {
    const mockEvents = [
      {
        _id: '1',
        title: 'Concierto de Rock',
        date: '2026-05-20',
        location: 'Estadio Central',
      },
      {
        _id: '2',
        title: 'Feria Gastronómica',
        date: '2026-06-15',
        location: 'Plaza Mayor',
      },
    ];
    const mockedGet = vi.mocked(api.get);
    mockedGet.mockResolvedValue({ data: mockEvents });

    render(
      <MemoryRouter>
        <AuthProvider>
          <OwnerDashboard />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Concierto de Rock/i)).toBeInTheDocument();
    expect(await screen.findByText(/Feria Gastronómica/i)).toBeInTheDocument();
    const deleteButtons = await screen.findAllByRole('button', {
      name: /Eliminar/i,
    });
    expect(deleteButtons).toHaveLength(2);
  });

  it('should show an empty state message when there are no events', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <AuthProvider>
          <OwnerDashboard />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/Aún no has publicado ningún evento./i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /\+ Crear Nuevo Evento/i })
    ).toBeInTheDocument();
  });

  it('should show an error message when the API call fails', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(
      new Error('Internal Server Error')
    );

    render(
      <MemoryRouter>
        <AuthProvider>
          <OwnerDashboard />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/No pudimos cargar tus eventos./i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/Tus Publicaciones/i)).not.toBeInTheDocument();
  });

  it('should display the correct count in the "Eventos Activos" card', async () => {
    const mockEvents = [
      { _id: '1', title: 'Evento 1', date: '2026-01-01', location: 'Lugar' },
      { _id: '2', title: 'Evento 2', date: '2026-01-02', location: 'Lugar' },
    ];
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockEvents });

    render(
      <MemoryRouter>
        <AuthProvider>
          <OwnerDashboard />
        </AuthProvider>
      </MemoryRouter>
    );

    const activeCount = await screen.findByText('2');
    expect(activeCount).toBeInTheDocument();
  });

  it('should call api.delete when the delete button is clicked', async () => {
    const mockEvents = [
      {
        _id: '123',
        title: 'Evento a Eliminar',
        date: '2026-05-20',
        location: 'Lugar',
      },
    ];

    vi.mocked(api.get).mockResolvedValue({ data: mockEvents });
    vi.mocked(api.delete).mockResolvedValue({ data: {} });
    const confirmSpy = vi
      .spyOn(window, 'confirm')
      .mockImplementation(() => true);

    render(
      <MemoryRouter>
        <AuthProvider>
          <OwnerDashboard />
        </AuthProvider>
      </MemoryRouter>
    );

    const deleteButton = await screen.findByRole('button', {
      name: /Eliminar/i,
    });
    fireEvent.click(deleteButton);
    expect(confirmSpy).toHaveBeenCalled();
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalled();
    });
  });
});
