import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/user';
import Button from '../components/Buttons';

const UserProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      {profile ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{profile.name}</h2>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          {profile.businessName && (
            <p>
              <strong>Negocio:</strong> {profile.businessName}
            </p>
          )}
          {profile.businessAddress && (
            <p>
              <strong>Dirección:</strong> {profile.businessAddress}
            </p>
          )}
          {profile.description && (
            <p>
              <strong>Descripción:</strong> {profile.description}
            </p>
          )}
          <div className="mt-6 flex gap-4">
            <Button
              onClick={() => navigate('/profile/change-password')}
              variant="primary"
              className="bg-blue-900"
            >
              Cambiar Contraseña
            </Button>
            <Button onClick={() => navigate('/profile/edit')} variant="primary">
              Editar Perfil
            </Button>
          </div>
        </div>
      ) : (
        <p>No se encontró el perfil.</p>
      )}
    </div>
  );
};

export default UserProfile;
