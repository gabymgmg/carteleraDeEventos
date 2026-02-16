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
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Bienvenido, {user?.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Gestionando:{' '}
            <span className="font-semibold">
              {user?.businessName || 'Tu Negocio'}
            </span>
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Ver Perfil
          </button>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => navigate('/create-event')}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            + Crear Nuevo Evento
          </button>
        </div>
      </div>

      {/* Stats/Quick Info Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-10">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">
            Eventos Activos
          </dt>
          {loading ? (
            <p>Cargando eventos...</p>
          ) : events.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-md">
              <p className="text-gray-500">Aún no tienes eventos.</p>
              <button
                onClick={() => navigate('/create-event')}
                className="text-blue-600"
              >
                Crear uno
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="p-4 border rounded shadow-sm flex justify-between"
                >
                  {/* Left side: Text info */}
                  <div>
                    <h4 className="font-bold">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {formatDateForInput(event.date).replace('T', ' ')}
                    </p>
                  </div>
                  <span className="text-blue-600 font-medium">
                    {event.category}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/edit-event/${event._id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">
            Vistas Totales
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">
            Estado de Cuenta
          </dt>
          <dd className="mt-1 text-sm font-semibold text-green-600 uppercase">
            Aprobada
          </dd>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
