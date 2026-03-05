import React, { useState } from 'react';
import api from '../api/axios';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Buttons';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setMessage(
        'Si existe una cuenta asociada a ese correo, se ha enviado un mensaje con instrucciones de recuperación.'
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="¿Olvidaste tu contraseña?"
      subtitle="Ingresa tu email para recibir instrucciones de recuperación"
    >
      {message && (
        <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          required
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" isLoading={loading} className="w-full">
          Enviar Link de Recuperación
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
