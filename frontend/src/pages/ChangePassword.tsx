import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validatePassword } from '../utils/validation';
import Input from '../components/Input';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { logout } = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validatePassword(
      formData.newPassword,
      formData.confirmNewPassword
    );
    if (validationError) return setError(validationError);

    try {
      await api.patch('/users/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      alert('Contraseña cambiada con éxito. Incia sesión nuevamente.');
      logout();
    } catch (error) {
      console.error('Error changing password:', error);
      setError('No se pudo cambiar la contraseña');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Cambiar Contraseña</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 gap-6 flex flex-col">
        <Input
          label="Contraseña Actual"
          type="password"
          name="currentPassword"
          id="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          required
        />
        <Input
          label="Nueva Contraseña"
          type="password"
          name="newPassword"
          id="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
        <Input
          label="Confirmar Nueva Contraseña"
          type="password"
          name="confirmNewPassword"
          id="confirmNewPassword"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          required
        />
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-800"
          >
            Cambiar Contraseña
          </button>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
