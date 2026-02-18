import type { ReactNode } from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, type LoginResponse } from './AuthContext';
import type { User } from '../types/user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false); // Finished checking
  }, []);

  const login = useCallback(
    (data: LoginResponse) => {
      localStorage.setItem('token', data.token);
      const profile = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        businessName: data.businessName,
      };
      localStorage.setItem('user', JSON.stringify(profile));
      setUser(profile);
      // Redirect based on role
      if (profile.role === 'admin') navigate('admin/dashboard');
      else navigate('/dashboard');
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const updateUser = useCallback((updatedData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...updatedData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {!loading ? (
        children
      ) : (
        <div className="h-screen flex items-center justify-center">
          Cargando...
        </div>
      )}{' '}
    </AuthContext.Provider>
  );
};
