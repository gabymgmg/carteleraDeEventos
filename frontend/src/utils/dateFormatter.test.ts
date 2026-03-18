import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDateDisplay } from './dateFormatter';

describe('dateFormatter Utility', () => {
  beforeEach(() => {
    // Tell Vitest to use a fake timer
    vi.useFakeTimers();
    // Set a specific date: May 20, 2026, at 20:00 UTC
    const date = new Date('2026-05-20T20:00:00Z');
    vi.setSystemTime(date);
  });

  afterEach(() => {
    // Restore the real clock after each test
    vi.useRealTimers();
  });

    it('should show the time formatted according to the local timezone', () => {
    const input = '2026-05-20T20:00:00Z';
    const result = formatDateDisplay(input);
    
    expect(result).toContain('20/05/2026');
    
    const expectedTime = new Intl.DateTimeFormat('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(new Date(input));

    expect(result).toContain(expectedTime);
    });

  it('should format an ISO string to a Spanish readable format', () => {
    const input = '2026-05-20T20:00:00Z';
    const result = formatDateDisplay(input);

    expect(result).toContain('20/05/2026');
  });

  it('should handle invalid date strings gracefully', () => {
    const result = formatDateDisplay('');
    expect(result).toBe('Fecha no disponible');
  });

  it('should be consistent with the time formatting', () => {
    const input = '2026-05-20T15:30:00Z';
    const result = formatDateDisplay(input);

    // This checks that the minutes and hours are included
    expect(result).toMatch(/\d{2}:\d{2}/);
  });
});
