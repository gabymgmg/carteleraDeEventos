import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Cartelera de eventos
      </Link>

      <div className="flex items-center space-x-4">
        {/* If an Admin or Owner is logged in */}
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Panel de Control
            </Link>
            <button
              onClick={logout}
              className="text-sm font-medium text-red-600 hover:text-red-800"
            >
              Salir
            </button>
          </>
        ) : (
          /* For the public*/
          <Link
            to="/login"
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Acceso Organizadores
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
