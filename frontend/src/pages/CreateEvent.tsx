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
  const handleCreateEvent = async (data: any) => {
    setLoading(true);
    const formDataToSend = new FormData();

    // Add content
    formDataToSend.append('title', data.title);
    formDataToSend.append('description', data.description);
    formDataToSend.append('date', data.date);
    formDataToSend.append('location', data.location);
    formDataToSend.append('category', data.category);
    // 'image should match with name configured in uplpoadCloud.single
    if (data.imageFile) {
      formDataToSend.append('image', data.imageFile);
    }

    try {
      await api.post('/events', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/dashboard');
    } catch (err) {
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
