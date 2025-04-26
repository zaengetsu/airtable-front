// src/contexts/AuthContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthor: (authorId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        const data = await response.json();

        if (!response.ok) {
          const msg =
            (data && (data.message || data.error || data.error?.message)) ||
            'Session expirée';
          throw new Error(msg);
        }

        setUser({
          id: data.id || data._id || '',
          email: data.email,
          name: data.name || data.username || data.email.split('@')[0],
          role: data.role || 'user'
        });
      } catch (err) {
        console.error('Erreur checkAuth:', err);
        localStorage.removeItem('token');
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error || data.error?.message)) ||
          'Erreur de connexion';
        throw new Error(msg);
      }

      if (!data.token) {
        throw new Error('Réponse invalide : token manquant');
      }
      localStorage.setItem('token', data.token);

      const userData = data.user || data;
      if (!userData || !userData.email) {
        throw new Error('Données utilisateur invalides');
      }

      setUser({
        id: userData.id || userData._id || '',
        email: userData.email,
        name: userData.name || userData.username || email.split('@')[0],
        role: userData.role || 'user'
      });
      setError(null);
    } catch (err) {
      console.error('Erreur login:', err);
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(msg);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;
  const isAuthor = (authorId: string) => user?.id === authorId;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      logout,
      isAuthenticated,
      isAdmin,
      isAuthor
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
