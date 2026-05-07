import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PublicDashboard from './PublicDashboard';
import type { Event } from '../types/event';

describe('PublicDashboard Page', () => {
  const mockEvents: Event[] = [
    {
      _id: '1',
      title: 'Concierto Rock',
      category: 'Concierto',
      location: 'Carabobo',
      description: 'Testing',
      date: '2026-06-20T20:00:00Z',
    },
    {
      _id: '2',
      title: 'Feria Gastronómica',
      category: 'Feria',
      location: 'Valencia',
      description: 'Testing',
      date: '2026-07-20T20:00:00Z',
    },
  ];

  it('should show available events from props', () => {
    render(
      <MemoryRouter>
        <PublicDashboard allEvents={mockEvents} loading={false} error={null} />
      </MemoryRouter>
    );

    expect(screen.getByText('Concierto Rock')).toBeInTheDocument();
    expect(screen.getByText('Feria Gastronómica')).toBeInTheDocument();
  });

  it('should filter events when clicking a category', async () => {
    render(
      <MemoryRouter>
        <PublicDashboard allEvents={mockEvents} loading={false} error={null} />
      </MemoryRouter>
    );

    const conciertoBtn = screen.getByRole('button', { name: /^Concierto$/i });
    fireEvent.click(conciertoBtn);

    expect(screen.getByText('Concierto Rock')).toBeInTheDocument();
    expect(screen.queryByText('Feria Gastronómica')).not.toBeInTheDocument();
  });

  it('should filter by text when user search', () => {
    render(
      <MemoryRouter>
        <PublicDashboard allEvents={mockEvents} loading={false} error={null} />
      </MemoryRouter>
    );

    const searchInput = screen.getByLabelText(/¿Qué buscas?/i);
    fireEvent.change(searchInput, { target: { value: 'Feria' } });

    expect(screen.getByText('Feria Gastronómica')).toBeInTheDocument();
    expect(screen.queryByText('Concierto Rock')).not.toBeInTheDocument();
  });

  it('should show empty state if no events match', () => {
    render(
      <MemoryRouter>
        <PublicDashboard allEvents={mockEvents} loading={false} error={null} />
      </MemoryRouter>
    );

    const searchInput = screen.getByLabelText(/¿Qué buscas?/i);
    fireEvent.change(searchInput, { target: { value: 'Evento Inexistente' } });

    expect(
      screen.getByText(/No hay eventos que coincidan/i)
    ).toBeInTheDocument();
  });

  it('should show spinner when loading is true', () => {
    render(
      <MemoryRouter>
        <PublicDashboard allEvents={[]} loading={true} error={null} />
      </MemoryRouter>
    );

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should show error message if error prop is set', () => {
    const errorMessage = 'Error al cargar eventos';
    render(
      <MemoryRouter>
        <PublicDashboard allEvents={[]} loading={false} error={errorMessage} />
      </MemoryRouter>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
