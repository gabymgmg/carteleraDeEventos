import React, { useState } from 'react';
import api from '../api/axios';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';

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
        'If an account exists with that email, we have sent reset instructions.'
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

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all active:scale-95 disabled:bg-blue-300"
        >
          {loading ? 'Enviando...' : 'Enviar Link de Recuperación'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
