import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Event } from '../types/event';
import EventCard from '../components/EventCard';
import Button from '../components/Buttons';

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
        alert('No se pudo eliminar el evento');
      }
    }
  };

return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="md:flex md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Bienvenido, {user?.name}
          </h2>
          <p className="text-gray-500 mt-1">
            Gestionando: <span className="font-semibold text-gray-700">{user?.businessName || 'Tu Negocio'}</span>
          </p>
          <div className="mt-4">
            <Button
              to="/profile"
              variant="secondary"
              className="text-sm"
            >
              Configurar Perfil
            </Button>
          </div>
        </div>

        <Button to="/create-event" variant="primary" className="shadow-md">
          + Crear Nuevo Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-12">
        <StatCard title="Eventos Activos" value={events.length} color="blue" />
        <StatCard title="Estado de Cuenta" value="Aprobada" color="green" isText />
        <StatCard title="Vistas Totales" value="0" color="purple" />
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-6">Tus Publicaciones</h3>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-pulse text-gray-400 font-medium">Cargando tus eventos...</div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-500 mb-6 text-lg">Aún no has publicado ningún evento.</p>
          <Button
            to="/create-event"
            variant="primary"
          >
            Publicar mi primer evento
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              actions={
                <div className="flex gap-2 w-full mt-2">
                  <Button
                    to={`/edit-event/${event._id}`}
                    variant="secondary"
                    className="flex-1 text-xs py-2"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(event._id!)}
                    variant="danger"
                    className="flex-1 text-xs py-2"
                  >
                    Eliminar
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color, isText = false }: any) => (
  <div className={`bg-white p-4 shadow-sm rounded-xl border-l-4 border-${color}-500`}>
    <dt className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</dt>
    <dd className={`mt-1 ${isText ? 'text-lg font-bold text-green-600' : 'text-3xl font-extrabold text-gray-900'}`}>
      {value}
    </dd>
  </div>
);

export default OwnerDashboard;