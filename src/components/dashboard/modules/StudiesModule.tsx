/**
 * Módulo de Gestión de Estudios
 */

'use client';

import { useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Button, Stack, TextField, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';

const SAMPLE_STUDIES = [
  {
    id: '1',
    patient: 'María García',
    studyType: 'Química Sanguínea Completa',
    requestDate: '2026-02-05',
    scheduledDate: '2026-02-10',
    status: 'PAID',
    amount: 850
  },
  {
    id: '2',
    patient: 'Carlos López',
    studyType: 'Biometría Hemática',
    requestDate: '2026-02-06',
    scheduledDate: '2026-02-11',
    status: 'PENDING_PAYMENT',
    amount: 450
  },
  {
    id: '3',
    patient: 'Luis Hernández',
    studyType: 'Perfil Tiroideo',
    requestDate: '2026-02-01',
    scheduledDate: '2026-02-03',
    status: 'COMPLETED',
    amount: 1200
  },
];

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Borrador',
  PENDING_PAYMENT: 'Pendiente de Pago',
  PAID: 'Pagado',
  IN_PROGRESS: 'En Proceso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado'
};

const STATUS_COLORS: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
  DRAFT: 'default',
  PENDING_PAYMENT: 'warning',
  PAID: 'info',
  IN_PROGRESS: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'error'
};

export default function StudiesModule() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudies = SAMPLE_STUDIES.filter(study => 
    study.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.studyType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Gestión de Estudios
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra solicitudes y resultados de laboratorio
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
        >
          Nueva Solicitud
        </Button>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar estudios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Paciente</TableCell>
                <TableCell>Tipo de Estudio</TableCell>
                <TableCell>Fecha Solicitud</TableCell>
                <TableCell>Fecha Programada</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudies.map((study) => (
                <TableRow key={study.id} hover>
                  <TableCell>
                    <Typography fontWeight="medium">
                      {study.patient}
                    </Typography>
                  </TableCell>
                  <TableCell>{study.studyType}</TableCell>
                  <TableCell>
                    {new Date(study.requestDate).toLocaleDateString('es-MX')}
                  </TableCell>
                  <TableCell>
                    {new Date(study.scheduledDate).toLocaleDateString('es-MX')}
                  </TableCell>
                  <TableCell>${study.amount} MXN</TableCell>
                  <TableCell>
                    <Chip 
                      label={STATUS_LABELS[study.status]} 
                      color={STATUS_COLORS[study.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small">Ver</Button>
                      {study.status === 'COMPLETED' && (
                        <Button size="small" startIcon={<DownloadIcon />}>
                          Resultados
                        </Button>
                      )}
                    </Stack>
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
