import type { ReactNode } from 'react';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, type User, type LoginResponse } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  // Lazy initialization: Check localStorage innmediately
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [loading] = useState(false);

  const login = useCallback(
    (data: LoginResponse) => {
      localStorage.setItem('token', data.token);
      const profile = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      };
      localStorage.setItem('user', JSON.stringify(profile));
      setUser(profile);
      navigate('/');
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
