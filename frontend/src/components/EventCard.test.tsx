import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EventCard from './EventCard';
import type { Event } from '../types/event';

describe('EventCard Component', () => {
  const mockEvent: Event = {
    _id: '1',
    title: 'Jazz Night',
    date: '2026-05-20T20:00:00Z',
    location: 'Grand Theater',
    category: 'Concierto',
    description: 'A wonderful musical evening',
    imageUrl: 'https://test.com/image.jpg',
  };

  it('should render the basic event information', () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.getByText('Jazz Night')).toBeInTheDocument();
    expect(screen.getByText('Grand Theater')).toBeInTheDocument();

    // Verify image has the correct src and alt text
    const img = screen.getByAltText('Jazz Night') as HTMLImageElement;
    expect(img.src).toBe('https://test.com/image.jpg');
  });

  it('should only show the category badge in default variant', () => {
    // Test default variant
    const { rerender } = render(
      <EventCard event={mockEvent} variant="default" />
    );
    expect(screen.getByText('Concierto')).toBeInTheDocument();

    // Test compact variant (where category should be hidden)
    rerender(<EventCard event={mockEvent} variant="compact" />);

    // We use queryByText because it returns null instead of throwing an error when not found
    expect(screen.queryByText('Concierto')).not.toBeInTheDocument();
  });

  it('should render multiple action buttons when provided', () => {
    const mockActions = (
      <>
        <button>Edit</button>
        <button>Delete</button>
      </>
    );

    render(<EventCard event={mockEvent} actions={mockActions} />);

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('should display the placeholder image if imageUrl is missing', () => {
    const eventWithoutImg = { ...mockEvent, imageUrl: '' };
    render(<EventCard event={eventWithoutImg} />);

    const img = screen.getByAltText('Jazz Night') as HTMLImageElement;
    // We check if it contains the placeholder URL defined in the component
    expect(img.src).toContain('via.placeholder.com');
  });
});
