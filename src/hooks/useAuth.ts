/**
 * Hook de Autenticación y Permisos
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole, hasPermission, hasAnyPermission, isAdmin, isSuperAdmin } from '@/lib/permissions';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  isNew?: boolean | number; // MySQL puede devolver 0/1 en lugar de true/false
  isAdmin?: boolean; // Puede administrar el sistema
}

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      // Verificar autenticación
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Cargar usuario inicial
    loadUser();

    // Escuchar eventos de actualización del usuario
    const handleUserUpdate = () => {
      loadUser();
    };

    window.addEventListener('user-updated', handleUserUpdate);
    
    return () => {
      window.removeEventListener('user-updated', handleUserUpdate);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    hasPermission: (permission: string) => 
      user ? hasPermission(user.role, permission) : false,
    hasAnyPermission: (permissions: string[]) =>
      user ? hasAnyPermission(user.role, permissions) : false,
    isAdmin: user ? isAdmin(user.role) : false,
    isSuperAdmin: user ? isSuperAdmin(user.role) : false,
    logout
  };
}
