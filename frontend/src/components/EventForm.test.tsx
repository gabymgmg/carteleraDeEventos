import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import EventForm from './EventForm';
import type { Event } from '../types/event';

describe('EventForm Component', () => {
  beforeEach(() => {
    global.URL.createObjectURL = vi.fn(() => 'mock-url-para-preview');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(
      <MemoryRouter>
        <EventForm
          buttonText="Crear Evento"
          loading={false}
          onSubmit={() => {}}
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hora/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ubicación/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Imagen del Evento/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Descripción del evento/i)
    ).toBeInTheDocument();
  });

  it('submits form with correct data', () => {
    const mockHandleSubmit = vi.fn();
    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    });
    // Mock global para URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-url-para-preview');
    global.URL.revokeObjectURL = vi.fn();

    render(
      <MemoryRouter>
        <EventForm
          buttonText="Crear Evento"
          loading={false}
          onSubmit={mockHandleSubmit}
        />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Título/i), {
      target: { value: 'Concierto de Rock' },
    });
    fireEvent.change(screen.getByLabelText(/Fecha/i), {
      target: { value: '2027-12-31' },
    });
    fireEvent.change(screen.getByLabelText(/Hora/i), {
      target: { value: '20:00' },
    });
    fireEvent.change(screen.getByLabelText(/Ubicación/i), {
      target: { value: 'Auditorio Nacional' },
    });
    fireEvent.change(screen.getByLabelText(/Categoría/i), {
      target: { value: 'Deportes' },
    });
    fireEvent.change(screen.getByLabelText(/Imagen del Evento/i), {
      target: { files: [file] },
    });
    fireEvent.change(screen.getByLabelText(/Descripción del evento/i), {
      target: { value: 'Un gran concierto para cerrar el año.' },
    });

    fireEvent.click(screen.getByText(/Crear Evento/i));

    expect(mockHandleSubmit).toHaveBeenCalledWith({
      title: 'Concierto de Rock',
      date: '2027-12-31T20:00',
      location: 'Auditorio Nacional',
      category: 'Deportes',
      imageFile: file,
      imageUrl: '',
      description: 'Un gran concierto para cerrar el año.',
    });
  });

  it('disables submit button when loading', () => {
    render(
      <MemoryRouter>
        <EventForm
          buttonText="Crear Evento"
          loading={true}
          onSubmit={() => {}}
        />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /Crear Evento/i });
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should not submit form and show error when required fields are missing', () => {
    const mockHandleSubmit = vi.fn();
    render(
      <MemoryRouter>
        <EventForm
          buttonText="Crear Evento"
          loading={false}
          onSubmit={mockHandleSubmit}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Crear Evento/i));

    expect(mockHandleSubmit).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Debes ingresar un título para el evento/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/La ubicación es necesaria/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Debes seleccionar una fecha/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Debes seleccionar una imagen para el evento/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/La descripción es necesaria/i)
    ).toBeInTheDocument();
  });

  it('should clear error messages when fields are corrected', () => {
    const mockHandleSubmit = vi.fn();
    render(
      <MemoryRouter>
        <EventForm
          buttonText="Crear Evento"
          loading={false}
          onSubmit={mockHandleSubmit}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Crear Evento/i));

    fireEvent.change(screen.getByLabelText(/Título/i), {
      target: { value: 'Concierto de Rock' },
    });
    expect(
      screen.queryByText(/Debes ingresar un título para el evento/i)
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Ubicación/i), {
      target: { value: 'Auditorio Nacional' },
    });
    expect(
      screen.queryByText(/La ubicación es necesaria/i)
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Fecha/i), {
      target: { value: '2027-12-31' },
    });
    expect(
      screen.queryByText(/Debes seleccionar una fecha/i)
    ).not.toBeInTheDocument();

    // Corregimos la imagen
    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    });
    const createObjectURLMock = vi.fn(() => 'mock-url-para-preview');
    global.URL.createObjectURL = createObjectURLMock;
    fireEvent.change(screen.getByLabelText(/Imagen del Evento/i), {
      target: { files: [file] },
    });
    expect(
      screen.queryByText(/Debes seleccionar una imagen para el evento/i)
    ).not.toBeInTheDocument();

    // Corregimos la descripción
    fireEvent.change(screen.getByLabelText(/Descripción del evento/i), {
      target: { value: 'Un gran concierto para cerrar el año.' },
    });
    expect(
      screen.queryByText(/La descripción es necesaria/i)
    ).not.toBeInTheDocument();
  });

  it('pre-fills form fields when initialData is provided', () => {
    const mockEvent: Event = {
      title: 'Concierto de Rock',
      date: '2027-12-31T20:00:00.000Z', // UTC absoluto
      location: 'Auditorio Nacional',
      category: 'Concierto',
      imageUrl: 'http://example.com/image.png',
      description: 'Un gran concierto para cerrar el año.',
    };

    render(
      <MemoryRouter>
        <EventForm
          initialData={mockEvent}
          buttonText="Guardar"
          loading={false}
          onSubmit={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Título/i)).toHaveValue('Concierto de Rock');
    expect(screen.getByLabelText(/Fecha/i)).toHaveValue('2027-12-31');
    expect(screen.getByLabelText(/Hora/i)).toHaveValue('20:00');
    expect(screen.getByLabelText(/Ubicación/i)).toHaveValue(
      'Auditorio Nacional'
    );
    expect(screen.getByLabelText(/Categoría/i)).toHaveValue('Concierto');
    expect(screen.getByLabelText(/Descripción del evento/i)).toHaveValue(
      'Un gran concierto para cerrar el año.'
    );
  });

  it('should show error when selected time is in the past', () => {
    const mockHandleSubmit = vi.fn();
    render(
      <MemoryRouter>
        <EventForm
          buttonText="Crear Evento"
          loading={false}
          onSubmit={mockHandleSubmit}
        />
      </MemoryRouter>
    );
    //
    const now = new Date();
    // Forzamos una hora exacta de hace una hora, sin segundos
    const pastDate = new Date(now.getTime() - 60 * 60 * 1000);
    pastDate.setSeconds(0);
    pastDate.setMilliseconds(0);

    const datePart = pastDate.toISOString().split('T')[0];
    const timePart = pastDate.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    fireEvent.change(screen.getByLabelText(/Fecha/i), {
      target: { value: datePart },
    });
    fireEvent.change(screen.getByLabelText(/Hora/i), {
      target: { value: timePart },
    });

    fireEvent.click(screen.getByText(/Crear Evento/i));
    expect(mockHandleSubmit).not.toHaveBeenCalled();
    expect(
      screen.getByText(/La hora seleccionada ya ha pasado/i)
    ).toBeInTheDocument();
  });
});
