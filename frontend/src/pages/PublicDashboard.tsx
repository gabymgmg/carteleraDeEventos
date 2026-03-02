import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Event } from '../types/event';
import { Link, useSearchParams } from 'react-router-dom';
import EventCard from '../components/EventCard';

const PublicDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current values from URL
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const location = searchParams.get('location') || '';
  const date = searchParams.get('date') || '';

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/events?${searchParams.toString()}`);
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchParams]); // It re-runs whenever the URL changes

  // Helper to "translate" filter changes into URL updates
  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Changes the text in the URL
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Eventos Disponibles</h1>
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['', 'Concierto', 'Teatro', 'Deportes', 'Feria'].map((cat) => (
          <button
            key={cat}
            onClick={() => updateFilter('category', cat)}
            className={`px-4 py-2 rounded-full border ${
              category === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            {cat === '' ? 'Todos' : cat}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
        {/* Search */}
        <input
          type="text"
          placeholder="¿Qué buscas?"
          className="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none flex-1"
          value={search}
          onChange={(e) => updateFilter('search', e.target.value)}
        />

        {/* Location Filter */}
        <input
          type="text"
          placeholder="Ubicación..."
          className="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={location}
          onChange={(e) => updateFilter('location', e.target.value)}
        />

        {/* Date Filter */}
        <input
          type="date"
          className="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          value={date}
          onChange={(e) => updateFilter('date', e.target.value)}
        />

        {/* The Reset Button */}
        {(category || search || location || date) && (
          <button
            onClick={() => setSearchParams({})}
            className="text-sm text-red-600 hover:text-red-800 font-semibold transition-colors"
          >
            Limpiar filtros ×
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
          <p className="text-gray-500 text-lg">
            No encontramos eventos que coincidan con tu búsqueda.
          </p>
          <button
            onClick={() => setSearchParams({})}
            className="mt-4 text-blue-600 font-bold"
          >
            Ver todos los eventos
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              actions={
                <Link
                  to={`/event/${event._id}`}
                  className="flex-1 text-center bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver Detalles
                </Link>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicDashboard;
