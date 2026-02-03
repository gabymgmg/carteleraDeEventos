import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Cartelera de eventos
      </Link>
      <div className="space-x-4">
        <Link to="/login" className="text-gray-600 hover:text-blue-600">
          Login
        </Link>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
