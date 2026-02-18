import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import type { Event } from '../types/event';
import EventForm from '../components/EventForm';

const EditEvent = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('No se pudo cargar el evento. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleEditEvent = async (formData: Event) => {
    setUpdating(true);
    setError('');

    try {
      await api.put(`/events/${id}`, formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el evento');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!event && !loading)
    return <div className="text-center py-10">Evento no encontrado.</div>;
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        Editar Evento
      </h2>

      {error && (
        <p className="text-red-500 mb-4 bg-red-50 p-2 rounded border border-red-200 text-center">
          {error}
        </p>
      )}

      <EventForm
        initialData={event || undefined}
        onSubmit={handleEditEvent}
        buttonText="Guardar Cambios"
        loading={updating}
      />
    </div>
  );
};

export default EditEvent;
