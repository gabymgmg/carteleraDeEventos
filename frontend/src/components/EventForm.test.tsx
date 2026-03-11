import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import EventForm from './EventForm';

describe('EventForm Component', () => {
    it('renders form fields correctly', () => {
        render(
            <MemoryRouter>
                <EventForm buttonText="Crear Evento" loading={false} onSubmit={() => {}} />
            </MemoryRouter>
        );
        
        expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Fecha/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Hora/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Ubicación/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Imagen del Evento/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Descripción del evento/i)).toBeInTheDocument();
    });

    it('submits form with correct data', () => {
        const mockHandleSubmit = vi.fn();
        const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
        // Mock global para URL.createObjectURL
        global.URL.createObjectURL = vi.fn(() => 'mock-url-para-preview');
        global.URL.revokeObjectURL = vi.fn(); 

        render(
            <MemoryRouter>
                <EventForm buttonText="Crear Evento" loading={false} onSubmit={mockHandleSubmit} />
            </MemoryRouter>
        );
        
        fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'Concierto de Rock' } });
        fireEvent.change(screen.getByLabelText(/Fecha/i), { target: { value: '2024-12-31' } });
        fireEvent.change(screen.getByLabelText(/Hora/i), { target: { value: '20:00' } });
        fireEvent.change(screen.getByLabelText(/Ubicación/i), { target: { value: 'Auditorio Nacional' } });
        fireEvent.change(screen.getByLabelText(/Categoría/i), { target: { value: 'Deportes' } });
        fireEvent.change(screen.getByLabelText(/Imagen del Evento/i), { target: { files: [file] } });
        fireEvent.change(screen.getByLabelText(/Descripción del evento/i), { target: { value: 'Un gran concierto para cerrar el año.' } });

        fireEvent.click(screen.getByText(/Crear Evento/i));
        
        expect(mockHandleSubmit).toHaveBeenCalledWith({
            title: 'Concierto de Rock',
            date: '2024-12-31T20:00',
            location: 'Auditorio Nacional',
            category: 'Deportes',
            imageFile: file,
            imageUrl: '',
            description: 'Un gran concierto para cerrar el año.'
        });
    });

    it('disables submit button when loading', () => {
        render(
            <MemoryRouter>
                <EventForm buttonText="Crear Evento" loading={true} onSubmit={() => {}} />
            </MemoryRouter>
        );
        
        const submitButton = screen.getByRole('button', { name: /procesando/i });
        expect(submitButton).toBeDisabled();
    });

    it('should not submit form and show error when required fields are missing', () => {
        const mockHandleSubmit = vi.fn();
        render(
            <MemoryRouter>
                <EventForm buttonText="Crear Evento" loading={false} onSubmit={mockHandleSubmit} />
            </MemoryRouter>
        );
        
        fireEvent.click(screen.getByText(/Crear Evento/i));
        
        expect(mockHandleSubmit).not.toHaveBeenCalled();
        expect(screen.getByText(/El título es obligatorio/i)).toBeInTheDocument();
    });
});