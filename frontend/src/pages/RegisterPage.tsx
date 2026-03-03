import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import { validatePassword } from '../utils/validation';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessAddress: '',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // This updates only the specific field that changed while keeping the others
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Frontend validation
    const validationError = validatePassword(
      formData.password,
      formData.confirmPassword
    );
    if (validationError) return setError(validationError);
    setLoading(true);

    try {
      // Preparing the data for submission
      const { confirmPassword, ...dataToSubmit } = formData;
      await api.post('/auth/register', dataToSubmit);
      setMessage(
        'Cuenta creada. Nuestro equipo revisará tu negocio y te aprobará en breve.'
      );
      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        businessName: '',
        businessAddress: '',
        description: '',
      });
    } catch (err) {
      // Type guarding to satisfy the strict linter
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            'Registration failed. Please try again.'
        );
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Registro" subtitle="Para Organizadores de Eventos">
      {message ? (
        <div className="text-center space-y-6 py-4">
          <div className="flex justify-center">
            <div className="bg-green-100 p-3 rounded-full">
              <svg
                className="h-12 w-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Aplicacion Recibida!
          </h2>
          <p className="text-gray-600 leading-relaxed">{message}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Cartelera de Eventos
          </button>
        </div>
      ) : (
        /* FORM VIEW */
        <>
          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Nombre"
              name="name"
              type="text"
              required
              placeholder="Nombre del Organizador"
              value={formData.name}
              onChange={handleChange}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              required
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Contraseña"
              name="password"
              type="password"
              required
              placeholder="Crea una contraseña"
              value={formData.password}
              onChange={handleChange}
            />

            <Input
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              required
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Business Profile
              </p>
              <Input
                label="Nombre del Negocio"
                name="businessName"
                type="text"
                required
                placeholder="Eventos XYZ"
                value={formData.businessName}
                onChange={handleChange}
              />
              <Input
                label="Dirección del Negocio"
                name="businessAddress"
                type="text"
                required
                placeholder="Calle Altura 123, Cuidad"
                value={formData.businessAddress}
                onChange={handleChange}
              />

              <Input
                label="Descripción"
                isTextArea={true}
                name="description"
                placeholder="Que tipo de eventos organizas?"
                value={formData.description}
                className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 sm:text-sm"
                onChange={handleChange}
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-300 transition-colors"
            >
              {loading ? 'Submitting Application...' : 'Apply for Account'}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Ya tienes una cuenta? Inicia Sesión
            </button>
          </div>
        </>
      )}
    </AuthLayout>
  );
};

export default RegisterPage;
