import React, { useState } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Buttons';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || 'Email o contraseña incorrectos'
        );
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Iniciar Sesión" subtitle="Panel de Organizadores">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
          <p className="text-red-700 text-sm text-center font-medium">
            {error}
          </p>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          required
          name="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Contraseña"
          type="password"
          required
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" isLoading={loading} className="w-full">
          Ingresar
        </Button>
      </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
    </AuthLayout>
  );
};

export default LoginPage;
