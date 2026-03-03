import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';

const EditUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    businessAddress: '',
    description: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setFormData({
          name: data.name || '',
          email: data.email || '',
          businessName: data.businessName || '',
          businessAddress: data.businessAddress || '',
          description: data.description || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/users/profile', formData);
      // Update AuthContext with the fresh data from the DB
      updateUser?.(data);
      alert('Perfil actualizado con éxito');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('No se pudo actualizar el perfil');
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Editar Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nombren del Organizador"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          readOnly
          disabled
        />
        <Input
          label="Nombre del Negocio"
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
        />
        <Input
          label="Dirección del Negocio"
          type="text"
          name="businessAddress"
          value={formData.businessAddress}
          onChange={handleChange}
        />
        <Input
          label="Descripción"
          isTextArea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
