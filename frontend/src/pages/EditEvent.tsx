import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

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

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Concierto',
    imageUrl: '',
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        console.log('Fetching event with ID:', id);
        const { data } = await api.get(`/events/${id}`);
        console.log('Datos del evento obtenidos:', data);
        setFormData({
          title: data.title,
          description: data.description,
          date: formatDateForInput(data.date),
          location: data.location,
          category: data.category,
          imageUrl: data.imageUrl || '',
        });
      } catch (err) {
        setError('No se pudo cargar el evento');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

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
      await api.put(`/events/${id}`, formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el evento');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
        Editar Evento
      </h2>

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
          {loading ? 'Actualizando evento...' : 'Actualizar Evento'}
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
