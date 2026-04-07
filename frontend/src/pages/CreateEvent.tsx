import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import EventForm from '../components/EventForm';
import type { Event } from '../types/event';

interface CreateEventProps {
  onEventCreated?: () => void; // Callback para notificar al padre que se creó un evento
}

const CreateEvent = ({ onEventCreated }: CreateEventProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Child will communicate trhough this function
  const handleCreateEvent = async (data: Event) => {
    setLoading(true);
    const formDataToSend = new FormData();

    // 1. Agregamos los textos
    formDataToSend.append('title', data.title);
    formDataToSend.append('description', data.description);
    formDataToSend.append('date', data.date);
    formDataToSend.append('location', data.location);
    formDataToSend.append('category', data.category || 'Concierto'); // Valor por defecto si no se selecciona categoría

    // 2. Agregamos el archivo
    if (data.imageFile instanceof File) {
      formDataToSend.append('image', data.imageFile);
    } else {
      setError('Por favor, selecciona una imagen válida para el evento.');
      setLoading(false);
      console.error('Error: El archivo no es una instancia de File válida.');
    }

    try {
      await api.post('/events', formDataToSend);
      onEventCreated?.(); // Notificamos al padre que se creó un evento
      navigate('/dashboard');
    } catch (err) {
      console.error('Error en la petición:', err);
      setError('Error al crear el evento');
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
