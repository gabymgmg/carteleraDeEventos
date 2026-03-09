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
  const handleCreateEvent = async (data: Event) => {
    setLoading(true);
    const formDataToSend = new FormData();

    formDataToSend.append('title', data.title);
    formDataToSend.append('description', data.description);
    formDataToSend.append('date', data.date);
    formDataToSend.append('location', data.location);
    formDataToSend.append('category', data.category || 'Concierto');

    if (data.imageFile instanceof File) {
      console.log('Enviando archivo real:', data.imageFile.name);
      // Usamos 'image' para que coincida con .single('image')
      formDataToSend.append('image', data.imageFile);
    } else {
      console.error(
        '¡CUIDADO! imageFile no es un archivo válido en este momento'
      );
    }

    try {
      await api.post('/events', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error completo:', err.response?.data || err.message);
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
