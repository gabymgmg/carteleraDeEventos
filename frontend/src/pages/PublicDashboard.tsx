import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Event } from '../types/event';
import { Link, useSearchParams } from 'react-router-dom';
import EventCard from '../components/EventCard';
import Input from '../components/Input';
import Button from '../components/Buttons';

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
      {/* Filtros de Categoría (Pills) */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
        {['', 'Concierto', 'Teatro', 'Deportes', 'Feria'].map((cat) => (
          <Button
            key={cat}
            onClick={() => updateFilter('category', cat)}
            variant={category === cat ? 'primary' : 'secondary'}
            className="rounded-full px-6 py-1 text-sm whitespace-nowrap"
          >
            {cat === '' ? 'Todos' : cat}
          </Button>
        ))}
      </div>

      {/* Barra de Búsqueda y Filtros Avanzados */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 items-end bg-white p-6 rounded-lg shadow-sm">
        <Input
          label="Búsqueda"
          placeholder="¿Qué quieres hacer?"
          value={search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="md:col-span-1"
        />

        <Input
          label="Ubicación"
          placeholder="Ciudad o lugar..."
          value={location}
          onChange={(e) => updateFilter('location', e.target.value)}
        />

        <Input
          label="Fecha"
          type="date"
          value={date}
          onChange={(e) => updateFilter('date', e.target.value)}
        />
        <div className="flex justify-end gap-4">
          {(category || search || location || date) && (
            <Button
              onClick={() => setSearchParams({})}
              className="text-sm text-red-600 hover:text-red-700 font-bold px-2 py-2"
            >
              Limpiar ×
            </Button>
          )}
        </div>
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
