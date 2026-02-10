/**
 * Módulo de Gestión de Administradores (Solo SUPERADMIN)
 */

'use client';

// import { useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Button, Stack, Alert, AlertTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ShieldIcon from '@mui/icons-material/Shield';

const SAMPLE_ADMINS = [
  { 
    id: '1', 
    firstName: 'Jesse', 
    lastName: 'Maria Vita', 
    email: 'JESSE.MARIAVITA@mariavita.com', 
    role: 'SUPERADMIN',
    createdAt: '2026-01-01',
    lastLogin: '2026-02-10'
  },
  { 
    id: '2', 
    firstName: 'Admin', 
    lastName: 'Sistema', 
    email: 'admin@mariavita.com', 
    role: 'ADMIN',
    createdAt: '2026-01-15',
    lastLogin: '2026-02-09'
  },
];

export default function AdminsModule() {
  return (
    <Box>
      <Alert severity="warning" sx={{ mb: 3 }}>
        <AlertTitle>Área Restringida</AlertTitle>
        Este módulo solo está disponible para Super Administradores. Aquí puedes gestionar 
        otros administradores del sistema.
      </Alert>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            <ShieldIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Gestión de Administradores
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra los usuarios con permisos administrativos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
          color="error"
        >
          Nuevo Admin
        </Button>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Creado</TableCell>
                <TableCell>Último Acceso</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {SAMPLE_ADMINS.map((admin) => (
                <TableRow key={admin.id} hover>
                  <TableCell>
                    <Typography fontWeight="medium">
                      {admin.firstName} {admin.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={admin.role === 'SUPERADMIN' ? 'Super Admin' : 'Admin'} 
                      color={admin.role === 'SUPERADMIN' ? 'error' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(admin.createdAt).toLocaleDateString('es-MX')}
                  </TableCell>
                  <TableCell>
                    {new Date(admin.lastLogin).toLocaleDateString('es-MX')}
                  </TableCell>
                  <TableCell align="right">
                    {admin.role !== 'SUPERADMIN' && (
                      <Button size="small" color="error">
                        Revocar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
