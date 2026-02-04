import { use } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = use(AuthContext);
  // Safety check. Tells if the hook is used outside the provider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
