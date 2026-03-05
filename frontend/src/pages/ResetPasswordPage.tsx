import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import axios from 'axios';
import { validatePassword } from '../utils/validation';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Buttons';

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const validationError = validatePassword(password, confirmPassword);
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setMessage('¡Contraseña actualizada! Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Error al restablecer');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Restablecer Contraseña"
      subtitle="Configura tu nueva contraseña"
    >
      {message && (
        <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="Nueva Contraseña"
          type="password"
          placeholder="Tu nueva contraseña"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirmar Nueva Contraseña"
          type="password"
          placeholder="Repite la contraseña"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button type="submit" isLoading={loading} className="w-full">
          Actualizar Contraseña
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
