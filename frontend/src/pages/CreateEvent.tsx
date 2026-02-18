import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import EventForm from '../components/EventForm';
import type { Event } from '../types/event';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Child will communicate trhough this function
  const handleCreateEvent = async (FormData: Event) => {
    setLoading(true);
    setError('');

    try {
      await api.post('/events', FormData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating event:', err);
      setError(
        'Hubo un error al crear el evento. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        Publicar Nuevo Evento
      </h2>

      {error && (
        <p className="text-red-500 mb-4 bg-red-50 p-2 rounded border border-red-200 text-center">
          {error}
        </p>
      )}

      <EventForm
        onSubmit={handleCreateEvent}
        buttonText="Crear Evento"
        loading={loading}
      />
    </div>
  );
};

export default CreateEvent;
