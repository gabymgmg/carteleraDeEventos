import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Bienvenido, {user?.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Gestionando:{' '}
            <span className="font-semibold">
              {user?.businessName || 'Tu Negocio'}
            </span>
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => navigate('/create-event')}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            + Crear Nuevo Evento
          </button>
        </div>
      </div>

      {/* Stats/Quick Info Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-10">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">
            Eventos Activos
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">
            Vistas Totales
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">
            Estado de Cuenta
          </dt>
          <dd className="mt-1 text-sm font-semibold text-green-600 uppercase">
            Aprobada
          </dd>
        </div>
      </div>

      {/* Placeholder for Event List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md p-10 text-center border-2 border-dashed border-gray-300">
        <p className="text-gray-500">Aún no has publicado ningún evento.</p>
        <button
          onClick={() => navigate('/create-event')}
          className="mt-4 text-blue-600 hover:underline font-medium"
        >
          ¡Empieza publicando el primero!
        </button>
      </div>
    </div>
  );
};

export default OwnerDashboard;
