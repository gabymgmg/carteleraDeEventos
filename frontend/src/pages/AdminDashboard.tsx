import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import axios from 'axios';

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

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await api.get('/users/pending');
      setPendingUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching pending users');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.put(`/users/approve/${id}`);
      setPendingUsers(pendingUsers.filter((user) => user._id !== id));
    } catch (err) {
      setError('Error approving user');
    }
  };
  if (loading) return <div className="p-8">Cargando solicitudes...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Solicitudes de Organizadores</h1>

      {pendingUsers.length === 0 ? (
        <p className="text-gray-500">No hay solicitudes pendientes.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre / Negocio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.businessName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleApprove(user._id)}
                      className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Aprobar
                    </button>
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
