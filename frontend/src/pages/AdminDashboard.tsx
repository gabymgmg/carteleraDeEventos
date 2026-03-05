import { useEffect, useState } from 'react';
import api from '../api/axios';
import Button from '../components/Buttons';

interface pendingUser {
  _id: string;
  name: string;
  email: string;
  businessName: string;
}

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState<pendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await api.get('/users/pending');
      setPendingUsers(response.data);
    } catch (err) {
      setError('Error fetching pending users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await api.put(`/users/approve/${id}`);
      setPendingUsers(pendingUsers.filter((user) => user._id !== id));
    } catch (err) {
      setError('Error approving user');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Cargando solicitudes...
      </div>
    );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Solicitudes de Organizadores
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          {error}
        </div>
      )}

      {pendingUsers.length === 0 ? (
        <div className="bg-gray-50 p-10 rounded-xl border-2 border-dashed text-center">
          <p className="text-gray-500">No hay solicitudes pendientes.</p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Nombre / Negocio
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {pendingUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.businessName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      onClick={() => handleApprove(user._id)}
                      variant="success"
                      isLoading={actionLoading === user._id}
                      className="text-sm"
                    >
                      Aprobar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
