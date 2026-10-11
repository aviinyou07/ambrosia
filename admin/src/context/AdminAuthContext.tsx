"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminLogin, getAdminProfile } from '@/lib/apis';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('ambrosia_admin_token');
        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        setToken(storedToken);
        const res = await getAdminProfile();
        if (res.success && res.data && res.data.role === 'admin') {
          setUser(res.data);
        } else {
          localStorage.removeItem('ambrosia_admin_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to restore admin session:', err);
        localStorage.removeItem('ambrosia_admin_token');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Redirect guard
  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== '/login') {
        router.push('/login');
      } else if (user && pathname === '/login') {
        router.push('/');
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await adminLogin({ email, password });
    setIsLoading(false);

    if (res.success && res.data) {
      if (res.data.user.role !== 'admin') {
        return {
          success: false,
          message: 'Access denied: Admin privileges required to enter this portal.',
        };
      }

      localStorage.setItem('ambrosia_admin_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      router.push('/');
      return { success: true };
    }

    return {
      success: false,
      message: res.message || 'Invalid email or password',
    };
  };

  const logout = () => {
    localStorage.removeItem('ambrosia_admin_token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
