import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import type { Event } from '../types/event';
import Button from '../components/Buttons';
import { formatDateDisplay } from '../utils/dateFormatter';

const EventDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        setError('No se pudo cargar el evento');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  if (!event)
    return (
      <div className="h-screen flex items-center justify-center">
        Evento no encontrado
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Button to="/" variant="secondary" className="mb-6 w-fit">
        ← Volver
      </Button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-96 object-cover"
          />
        )}

        <div className="p-8">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase">
            {event.category}
          </span>
          <h1 className="text-4xl font-bold mt-4 text-gray-900">
            {event.title}
          </h1>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-bold">📅 Fecha:</span>
              {formatDateDisplay(event.date)}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">📍 Ubicación:</span>
              {event.location}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">👤 Organizado por:</span>
              {typeof event.owner === 'object'
                ? event.owner.name
                : 'Organizador'}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Sobre este evento
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <div className="mt-10 p-6 bg-blue-50 rounded-xl border border-blue-100 text-center flex flex-col items-center gap-4">
            <p className="text-blue-800 font-semibold text-lg">
              ¿Te interesa este evento?
            </p>
            <Button variant="primary">Reservar Entradas</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
