import { describe, it, expect } from 'vitest';
import { validateEvent } from './validation';
import type { Event } from '../types/event';

describe('validateEvent', () => {
  const baseData: Event = {
    title: 'Concierto Rock',
    description: 'Una descripción larga...',
    date: '2026-12-01T12:00', // Una fecha futura
    location: 'Estadio Central',
    category: 'Concierto',
    imageUrl: 'http://imagen.com/test.jpg',
  };

  it('should return no errors for valid data', () => {
    const errors = validateEvent(baseData, null);
    expect(Object.keys(errors).length).toBe(0);
  });

  it('should return an error for missing title', () => {
    const errors = validateEvent({ ...baseData, title: '' }, null);
    expect(errors.title).toBe('Debes ingresar un título para el evento');
  });

  it('should return an error for missing location', () => {
    const errors = validateEvent({ ...baseData, location: '' }, null);
    expect(errors.location).toBe('La ubicación es necesaria');
  });

  it('should return an error for missing date', () => {
    const errors = validateEvent({ ...baseData, date: '' }, null);
    expect(errors.date).toBe('Debes seleccionar una fecha');
  });

  it('should return an error for past date', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Un día en el pasado
    const errors = validateEvent(
      { ...baseData, date: pastDate.toISOString() },
      null
    );
    expect(errors.date).toBe(
      'La fecha no puede ser anterior al momento actual'
    );
  });

  it('should return an error for missing image', () => {
    const errors = validateEvent({ ...baseData, imageUrl: '' }, null);
    expect(errors.image).toBe('Debes seleccionar una imagen para el evento');
  });

  it('should return an error for missing description', () => {
    const errors = validateEvent({ ...baseData, description: '' }, null);
    expect(errors.description).toBe('La descripción es necesaria');
  });
});
