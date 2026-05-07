import { useState, useEffect } from 'react';
import api from '../api/axios';
import type { User } from '../types/user';
import Button from '../components/Buttons';
import Spinner from '../components/Spinner';

const UserProfile = () => {
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] w-full">
        <Spinner message="Cargando tu información de perfil..." size="md" />
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Button to="/dashboard" variant="secondary" className="mb-6 w-fit">
        ← Volver al Panel
      </Button>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

      {profile ? (
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <div className="space-y-4 text-gray-700">
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold text-blue-900">
                {profile.name}
              </h2>
              <p className="text-gray-500">{profile.email}</p>
            </div>

            {profile.businessName && (
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase text-gray-400">
                  Negocio
                </span>
                <p className="text-lg">{profile.businessName}</p>
              </div>
            )}

            {profile.businessAddress && (
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase text-gray-400">
                  Dirección
                </span>
                <p className="text-lg">{profile.businessAddress}</p>
              </div>
            )}

            {profile.description && (
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase text-gray-400">
                  Descripción
                </span>
                <p className="text-lg italic text-gray-600">
                  "{profile.description}"
                </p>
              </div>
            )}
          </div>

          <div className="mt-10 flex flex-wrap gap-4 border-t pt-6">
            <Button to="/profile/edit" variant="primary" className="px-8">
              Editar Perfil
            </Button>
            <Button to="/profile/change-password" variant="secondary">
              Cambiar Contraseña
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-xl">
          <p className="text-gray-500">No se encontró el perfil.</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
