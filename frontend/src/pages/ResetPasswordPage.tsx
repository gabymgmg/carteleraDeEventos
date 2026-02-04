import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import axios from 'axios';
import { validatePassword } from '../utils/validation';

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    // Password validation
    const validationError = validatePassword(password, confirmPassword);
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      // We sent the token in the URL and the password in the body
      await api.post(`/auth/reset-password/${token}`, { password });
      setMessage('Password updated! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Reset failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full p-10 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">Set New Password</h2>

        {message && (
          <p className="text-green-600 text-center mt-4 bg-green-50 p-2 rounded">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 text-center mt-4 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full p-2 border rounded"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full p-2 border rounded"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={loading ? "bg-gray-400" : "bg-blue-600"}
          >
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
