import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Event } from '../types/event';

const formatDateForInput = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);

  // This calculates the local offset and builds the YYYY-MM-DDTHH:MM string
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events/my-events');
        if (data && Array.isArray(data)) setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      try {
        await api.delete(`/events/${id}`);
        setEvents(events.filter((event) => event._id !== id));
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('No se pudo eliminar el evento');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Bienvenido, {user?.name}
          </h2>
          <p className="text-gray-500">
            Gestionando: {user?.businessName || 'Tu Negocio'}
          </p>
        </div>
        <button
          onClick={() => navigate('/create-event')}
          className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all"
        >
          + Crear Nuevo Evento
        </button>
      </div>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-10">
        <div className="bg-white p-5 shadow rounded-lg border-l-4 border-blue-500">
          <dt className="text-sm font-medium text-gray-500">Eventos Activos</dt>
          <dd className="text-2xl font-bold text-gray-900">{events.length}</dd>
        </div>
        <div className="bg-white p-5 shadow rounded-lg border-l-4 border-green-500">
          <dt className="text-sm font-medium text-gray-500">
            Estado de Cuenta
          </dt>
          <dd className="text-sm font-bold text-green-600 uppercase">
            Aprobada
          </dd>
        </div>
        <div className="bg-white p-5 shadow rounded-lg border-l-4 border-purple-500">
          <dt className="text-sm font-medium text-gray-500">Vistas Totales</dt>
          <dd className="text-2xl font-bold text-gray-900">0</dd>
        </div>
      </div>

      {/* Event list with images */}
      <h3 className="text-xl font-bold text-gray-800 mb-6">Tus Eventos</h3>

      {loading ? (
        <p className="text-center py-10">Cargando eventos...</p>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 border-2 border-dashed rounded-xl">
          <p className="text-gray-500 mb-4">Aún no has publicado nada.</p>
          <button
            onClick={() => navigate('/create-event')}
            className="text-blue-600 font-bold underline"
          >
            Empieza aquí
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
            >
              {/* Event image */}
              <div className="h-40 w-full relative">
                <img
                  src={
                    event.imageUrl ||
                    'https://via.placeholder.com/400x200?text=Sin+Imagen'
                  }
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold px-2 py-1 rounded">
                  {event.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h4 className="text-lg font-bold text-gray-900 truncate">
                  {event.title}
                </h4>
                <div className="mt-2 text-sm text-gray-500 flex flex-col space-y-1">
                  <span>📅 {formatDateForInput(event.date).split('T')[0]}</span>
                  <span className="truncate">📍 {event.location}</span>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-between gap-3">
                  <button
                    onClick={() => navigate(`/edit-event/${event._id}`)}
                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => event._id && handleDelete(event._id)}
                    className="flex-1 px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
