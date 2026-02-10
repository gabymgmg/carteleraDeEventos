import { createContext } from 'react';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse extends User {
  token: string;
}

export interface AuthContextType {
  user: User | null;
  login: (data: LoginResponse) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
