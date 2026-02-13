import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Event } from '../types/event';
import { Link, useSearchParams } from 'react-router-dom';

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
      try {
        const { data } = await api.get(`/events?${searchParams.toString()}`);
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
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

      {events.length === 0 ? (
        <p className="text-gray-500">
          No hay eventos disponibles en este momento.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-gray-600 mt-2">{event.description}</p>
                <p className="text-gray-500 mt-4 text-sm">
                  {new Date(event.date).toLocaleDateString()} - 📍
                  {event.location}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Categoría: {event.category}
                </p>
              </div>
              <Link
                to={`/event/${event._id}`}
                className="mt-4 block text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded-md transition-colors"
              >
                Ver Detalles
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicDashboard;
