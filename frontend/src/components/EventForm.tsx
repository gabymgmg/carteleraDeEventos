import { use, useEffect, useState } from 'react';
import type { Event } from '../types/event';
import { useNavigate } from 'react-router-dom';
import { formatDateForInput } from '../utils/dateFormatter';

interface EventFormProps {
  initialData?: Event;
  onSubmit: (data: Event) => void;
  buttonText: string;
  loading: boolean;
}

const EventForm = ({
  initialData,
  onSubmit,
  buttonText,
  loading,
}: EventFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Event>({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Concierto',
    imageUrl: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      // Convert date from DB to local ISO format for input
      setFormData({
        ...initialData,
        date: initialData.date ? formatDateForInput(initialData.date) : '',
      });
    }
  }, [initialData]);

  // Helper functions to split date and time for the form inputs
  const getDatePart = () => formData.date.split('T')[0] || '';
  const getTimePart = () =>
    formData.date.split('T')[1]?.substring(0, 5) || '12:00';

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Generates local preview
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, imageFile: file } as any);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 mb-6 hover:underline"
      >
        &larr; Volver
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">{buttonText}</h2>

        <div className="space-y-2">
          <label className="block font-medium text-gray-700">
            Título del Evento
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              value={getDatePart()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date: `${e.target.value}T${getTimePart()}`,
                })
              }
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Hora</label>
            <input
              type="time"
              value={getTimePart()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date: `${getDatePart()}T${e.target.value}`,
                })
              }
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-700">Ubicación</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-700">Categoría</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="Concierto">Concierto</option>
            <option value="Teatro">Teatro</option>
            <option value="Deportes">Deportes</option>
            <option value="Feria">Feria</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-700">
            URL de la Imagen (Opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            name="imageUrl"
            //value={formData.imageUrl || ''}
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          {/* show the preview if exists or the actual image if editing */}
          {(preview || formData.imageUrl) && (
            <img
              src={preview || formData.imageUrl}
              alt="Preview"
              className="mt-4 h-48 w-full object-cover rounded-md border"
            />
          )}
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-700">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Guardando...' : buttonText}
        </button>
      </form>
    </div>
  );
};

export default EventForm;
