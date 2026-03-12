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
  const selectedDate = new Date(formData.date);
  const now = new Date();
  const datePart = formData.date.split('T')[0];
  
  if (!formData.title.trim()) {
    newErrors.title = 'Debes ingresar un título para el evento';
  }

  if (!formData.location.trim()) {
    newErrors.location = 'La ubicación es necesaria';
  }
  // Date validation: Must be a valid date and not in the past
  if (!datePart || datePart === '' || formData.date.includes('undefined')) {
  newErrors.date = 'Debes seleccionar una fecha';
  } 
  // if there's a date, we check if time is in the past
  else if (selectedDate < now) {
    if (selectedDate.toDateString() !== now.toDateString()) {
      newErrors.date = 'La fecha no puede ser anterior al momento actual';
    } else {
      newErrors.date = 'La hora seleccionada ya ha pasado';
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
