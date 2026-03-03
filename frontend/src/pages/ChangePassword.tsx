import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validatePassword } from '../utils/validation';
import Input from '../components/Input';
import Button from '../components/Buttons';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);

    const validationError = validatePassword(
      formData.newPassword,
      formData.confirmNewPassword
    );

    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Cambiar Contraseña</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 gap-6 flex flex-col"
      >
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
          <Button type="submit" variant="success" isLoading={isLoading}>
            Cambiar Contraseña
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/profile')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
