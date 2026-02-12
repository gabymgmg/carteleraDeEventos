import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Concierto',
    imageUrl: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/events', formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el evento');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
          Publicar Nuevo Evento
        </h2>

        {error && (
          <p className="text-red-500 mb-4 bg-red-50 p-2 rounded">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Título del Evento
            </label>
            <input
              type="text"
              name="title"
              required
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: Festival de Jazz Verano"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Fecha y Hora
              </label>
              <input
                type="datetime-local"
                name="date"
                required
                className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Categoría
              </label>
              <select
                name="category"
                className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Concierto">Concierto</option>
                <option value="Teatro">Teatro</option>
                <option value="Deportes">Deportes</option>
                <option value="Feria">Feria</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Ubicación
            </label>
            <input
              type="text"
              name="location"
              required
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Calle, Ciudad, Estadio..."
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Descripción
            </label>
            <textarea
              name="description"
              required
              rows={4}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Cuéntanos más sobre el evento..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Imagen del Evento
            </label>
            <input
              type="text"
              name="imageUrl"
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="URL de la imagen del evento..."
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-white font-bold transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Publicando...' : 'Crear Evento'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
