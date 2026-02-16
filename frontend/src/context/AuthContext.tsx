import { createContext } from 'react';
import type { User } from '../types/user';

export interface LoginResponse extends User {
  token: string;
}

export interface AuthContextType {
  user: User | null;
  login: (data: LoginResponse) => void;
  logout: () => void;
  loading: boolean;
  updateUser?: (updatedUser: User) => void; 
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
