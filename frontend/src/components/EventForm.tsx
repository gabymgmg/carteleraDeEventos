import { useEffect, useState } from 'react';
import type { Event } from '../types/event';
import { formatDateForInput } from '../utils/dateFormatter';
import Input from './Input';
import Button from './Buttons';
import { validateEvent } from '../utils/validation';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const selectFileClasses =
    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm bg-white';

  // Efecto para cargar datos iniciales (Edit Mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date ? formatDateForInput(initialData.date) : '',
      });
    }
  }, [initialData]);

  // EFECTO DE LIMPIEZA: Libera la memoria de la URL cuando el componente se destruye
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const getDatePart = () => formData.date.split('T')[0] || '';
  const getTimePart = () =>
    formData.date.split('T')[1]?.substring(0, 5) || '12:00';

  const clearError = (name: string) => {
    if (errors[name]) {
      setErrors((prev) => {
        // Creamos una copia de los errores actuales (prev) para no romper el estado original
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Actualiza el valor del formulario 
    setFormData({ ...formData, [name]: value });

    // Si había un error para este campo, se borra
    clearError(name);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      // Si ya había una previsualización anterior, liberamos su memoria
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setFile(selectedFile);
      
      // Creamos la nueva URL y la guardamos en el estado
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateEvent(formData, file);
    // If there are validation errors, we set them in state and stop the submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({}); // Clear any previous errors if validation passes
    onSubmit({ ...formData, imageFile: file } as any);

  };

  

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Button to="/dashboard" variant="secondary" className="mb-6 w-fit">
        &larr; Volver
      </Button>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 space-y-6"
      >
        <Input
          label="Título"
          placeholder="Ej: Jam de Rock Nacional"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha"
            name="date"
            type="date"
            value={getDatePart()}
            onChange={(e) => {
                setFormData({
                  ...formData,
                  date: `${e.target.value}T${getTimePart()}`,
                });
                clearError('date'); 
              }}
              error={errors.date}
          />
          <Input
            label="Hora"
            name="time"
            type="time"
            value={getTimePart()}
            onChange={(e) =>{
              setFormData({
                ...formData,
                date: `${getDatePart()}T${e.target.value}`,
              })
              clearError('date');
            }}
            error={errors.date}
          />
        </div>

        <Input
          label="Ubicación"
          type="text"
          name="location"
          value={formData.location}
          placeholder="Dirección o lugar del evento"
          onChange={handleChange}
          error={errors.location}
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
          <label htmlFor="image-upload" className="block text-sm font-semibold text-gray-700">
            Imagen del Evento
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={`${selectFileClasses} file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer`}
          />
          {errors.image && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.image}</p>
          )}
          
          {(preview || formData.imageUrl) && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vista previa de la imagen
              </label>
              <div className="rounded-xl border-2 border-gray-200 overflow-hidden shadow-inner bg-gray-50">
                <img
                  src={preview || formData.imageUrl}
                  alt="Preview"
                  className="h-64 w-full object-contain"
                />
              </div>
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
          error={errors.description}
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