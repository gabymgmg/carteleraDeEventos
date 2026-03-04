import { useEffect, useState } from 'react';
import type { Event } from '../types/event';
import { useNavigate } from 'react-router-dom';
import { formatDateForInput } from '../utils/dateFormatter';
import Input from './Input';
import Button from './Buttons';

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
  const selectFileClasses =
    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm bg-white';

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
      // Clean up previous preview URL if exists
      if (preview) URL.revokeObjectURL(preview);

      setPreview(URL.createObjectURL(selectedFile)); // Generates local preview
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, imageFile: file } as any);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Button onClick={() => navigate(-1)} variant="secondary" className="mb-6">
        &larr; Volver
      </Button>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">{buttonText}</h2>

        <Input
          label="Título"
          placeholder="Ej: Jam de Rock Nacional"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha"
            type="date"
            value={getDatePart()}
            onChange={(e) =>
              setFormData({
                ...formData,
                date: `${e.target.value}T${getTimePart()}`,
              })
            }
            required
          />
          <Input
            label="Hora"
            type="time"
            value={getTimePart()}
            onChange={(e) =>
              setFormData({
                ...formData,
                date: `${getDatePart()}T${e.target.value}`,
              })
            }
            required
          />
        </div>
        <Input
          label="Ubicación"
          type="text"
          name="location"
          value={formData.location}
          placeholder="Dirección o lugar del evento"
          onChange={handleChange}
          required
        />

        <div className="space-y-1">
          <label
            htmlFor="category-select"
            className="block text-sm font-semibold text-gray-700"
          >
            Categoría
          </label>
          <select
            id="category-select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={selectFileClasses}
          >
            <option value="Concierto">Concierto</option>
            <option value="Teatro">Teatro</option>
            <option value="Deportes">Deportes</option>
            <option value="Feria">Feria</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700">
            Imagen del Evento
          </label>
          <input
            type="file"
            accept="image/*"
            name="imageUrl"
            //value={formData.imageUrl || ''}
            onChange={handleFileChange}
            className={`${selectFileClasses} file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer`}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          {/* show the preview if exists or the actual image if editing */}
          {(preview || formData.imageUrl) && (
            <div className="mt-4 relative group">
              <img
                src={preview || formData.imageUrl}
                alt="Preview"
                className="h-48 w-full object-cover rounded-xl border-2 border-dashed border-gray-200"
              />
              <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all rounded-xl" />
            </div>
          )}
        </div>

        <Input
          label="Descripción del evento"
          isTextArea={true}
          name="description"
          placeholder="Describe de qué trata el evento..."
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        />

        <Button
          type="submit"
          isLoading={loading}
          className="w-full py-2 text-lg"
        >
          {buttonText}
        </Button>
      </form>
    </div>
  );
};

export default EventForm;
