import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    businessAddress: '',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // This updates only the specific field that changed while keeping the others
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await api.post('/auth/register', formData);
      login(data);
    } catch (err) {
      // Type guarding to satisfy the strict linter
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            'Registration failed. Please try again.'
        );
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Join the Billboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create an account to post and manage events.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <input
              name="name"
              type="text"
              required
              placeholder="Full Name"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email Address"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              required
              placeholder="Password (min. 6 characters)"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={handleChange}
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Business Profile (Optional)
            </p>
            <input
              name="businessName"
              type="text"
              placeholder="Business Name"
              className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 mb-2 sm:text-sm"
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="What kind of events do you host?"
              className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 sm:text-sm"
              onChange={handleChange}
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Register Now
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
