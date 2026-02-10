'use client';

import React from 'react';
import { Avatar, AvatarProps } from '@mui/material';

interface ClinicAvatarProps extends Omit<AvatarProps, 'children'> {
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Avatar con colores de la clínica María Vita
 * Mostrar foto si existe, sino avatar con iniciales y colores corporativos
 */
export const ClinicAvatar: React.FC<ClinicAvatarProps> = ({
  firstName = '',
  lastName = '',
  photoUrl,
  size = 'medium',
  sx,
  ...props
}) => {
  // Colores corporativos María Vita (azul y blanco)
  const clinicColors = [
    { bg: '#1e40af', text: '#ffffff' }, // Azul profundo
    { bg: '#2563eb', text: '#ffffff' }, // Azul clínica
    { bg: '#0284c7', text: '#ffffff' }, // Azul cielo
    { bg: '#0369a1', text: '#ffffff' }, // Azul oscuro
  ];

  // Seleccionar color basado en el nombre
  const getColorIndex = () => {
    const combined = `${firstName}${lastName}`;
    if (!combined) return 0;
    return combined.charCodeAt(0) % clinicColors.length;
  };

  const color = clinicColors[getColorIndex()];

  // Obtener iniciales
  const initials = `${(firstName || 'U')[0]}${(lastName || 'S')[0]}`.toUpperCase();

  // Dimensiones según tamaño
  const sizeMap = {
    small: { width: 32, height: 32, fontSize: '0.75rem' },
    medium: { width: 48, height: 48, fontSize: '1rem' },
    large: { width: 80, height: 80, fontSize: '1.75rem' },
  };

  const dimensions = sizeMap[size];

  // Si hay foto, mostrarla
  if (photoUrl) {
    return (
      <Avatar
        src={photoUrl}
        alt={`${firstName} ${lastName}`}
        sx={{
          ...dimensions,
          ...sx,
        }}
        {...props}
      />
    );
  }

  // Sino, mostrar avatar con iniciales y colores de clínica
  return (
    <Avatar
      sx={{
        ...dimensions,
        backgroundColor: color.bg,
        color: color.text,
        fontWeight: 600,
        fontSize: dimensions.fontSize,
        ...sx,
      }}
      {...props}
    >
      {initials}
    </Avatar>
  );
};

export default ClinicAvatar;
