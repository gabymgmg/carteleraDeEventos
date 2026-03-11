import type {Event} from '../types/event';

export const validatePassword = (
  password: string,
  confirm: string
): string | null => {
  if (password.length < 6) return 'Password must be at least 6 characters long';
  if (password !== confirm) return 'Passwords do not match';
  return null; // No errors
};

export const validateEvent = (formData: Event, file: File | null): Record<string, string> => {
  const newErrors: Record<string, string> = {};

  if (!formData.title.trim()) {
    newErrors.title = 'Debes ingresar un título para el evento';
  }

  if (!formData.location.trim()) {
    newErrors.location = 'La ubicación es necesaria';
  }
  // Date validation: Must be a valid date and not in the past
  if (!formData.date || formData.date.includes('undefined')) {
    newErrors.date = 'Debes seleccionar una fecha y hora';
  } else {
    const selectedDate = new Date(formData.date);
    if(selectedDate < new Date()) {
      newErrors.date = 'La fecha no puede ser anterior al momento actual';
    }
  }

  // Imagen (Binario nuevo o URL existente si es edición)
  if (!file && !formData.imageUrl) {
    newErrors.image = 'Debes seleccionar una imagen para el evento';
  }

  if (!formData.description.trim()) {
    newErrors.description = 'La descripción es necesaria';
  }

  return newErrors; 
};