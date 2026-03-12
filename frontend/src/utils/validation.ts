import type { Event } from '../types/event';

export const validatePassword = (
  password: string,
  confirm: string
): string | null => {
  if (password.length < 6)
    return 'La contraseña debe tener al menos 6 caracteres';
  if (password !== confirm) return 'Las contraseñas no coinciden';
  return null; // No errors
};

export const validateEvent = (
  formData: Event,
  file: File | null
): Record<string, string> => {
  const newErrors: Record<string, string> = {};

  if (!formData.title.trim()) {
    newErrors.title = 'Debes ingresar un título para el evento';
  }

  if (!formData.location.trim()) {
    newErrors.location = 'La ubicación es necesaria';
  }
  // Date validation: Must be a valid date and not in the past
  const datePart = formData.date.split('T')[0];
  if (!datePart || datePart === '') {
    newErrors.date = 'Debes seleccionar una fecha';
  } else {
    const selectedDate = new Date(formData.date);
    if (selectedDate < new Date()) {
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
