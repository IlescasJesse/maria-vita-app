/**
 * Sistema de Permisos - Maria Vita
 * Gestiona permisos y autorización basada en roles
 */

import { ROLE_PERMISSIONS } from '@/types/enums';

export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'SPECIALIST' | 'PATIENT' | 'RECEPTIONIST';
export type Permission = string;

/**
 * Verifica si un rol tiene un permiso específico
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const roleKey = role.toLowerCase() as keyof typeof ROLE_PERMISSIONS;
  const permissions = ROLE_PERMISSIONS[roleKey] || [];
  
  // SUPERADMIN tiene todos los permisos
  if (role === 'SUPERADMIN') {
    return true;
  }
  
  return (permissions as readonly string[]).includes(permission);
}

/**
 * Verifica si un rol tiene al menos uno de los permisos especificados
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Verifica si un rol tiene todos los permisos especificados
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Obtiene todos los permisos de un rol
 */
export function getRolePermissions(role: UserRole): readonly string[] {
  const roleKey = role.toLowerCase() as keyof typeof ROLE_PERMISSIONS;
  return ROLE_PERMISSIONS[roleKey] || [];
}

/**
 * Verifica si un usuario es administrador (SUPERADMIN o ADMIN)
 */
export function isAdmin(role: UserRole): boolean {
  return role === 'SUPERADMIN' || role === 'ADMIN';
}

/**
 * Verifica si un usuario es SUPERADMIN
 */
export function isSuperAdmin(role: UserRole): boolean {
  return role === 'SUPERADMIN';
}

/**
 * Obtiene el label en español del rol
 */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    SUPERADMIN: 'Super Administrador',
    ADMIN: 'Administrador',
    SPECIALIST: 'Especialista',
    PATIENT: 'Paciente',
    RECEPTIONIST: 'Recepcionista'
  };
  return labels[role] || role;
}

/**
 * Obtiene el color del rol para UI
 */
export function getRoleColor(role: UserRole): 'error' | 'primary' | 'success' | 'info' | 'warning' {
  const colors: Record<UserRole, 'error' | 'primary' | 'success' | 'info' | 'warning'> = {
    SUPERADMIN: 'error',
    ADMIN: 'primary',
    SPECIALIST: 'success',
    PATIENT: 'info',
    RECEPTIONIST: 'warning'
  };
  return colors[role] || 'info';
}
