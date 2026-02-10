/**
 * Módulo de Gestión de Citas
 */

'use client';

import { useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Button, Stack, TextField, InputAdornment,
  Tabs, Tab
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const SAMPLE_APPOINTMENTS = [
  { 
    id: '1', 
    patient: 'María García',
    specialist: 'Dr. Juan Pérez',
    specialty: 'Cardiología',
    date: '2026-02-10',
    time: '10:00',
    status: 'CONFIRMED'
  },
  { 
    id: '2', 
    patient: 'Carlos López',
    specialist: 'Dr. Pedro González',
    specialty: 'Medicina General',
    date: '2026-02-08',
    time: '15:00',
    status: 'PENDING'
  },
  { 
    id: '3', 
    patient: 'María García',
    specialist: 'Dra. Ana Martínez',
    specialty: 'Radiología',
    date: '2026-02-05',
    time: '09:00',
    status: 'COMPLETED'
  },
  { 
    id: '4', 
    patient: 'Luis Hernández',
    specialist: 'Dr. Miguel Rodríguez',
    specialty: 'Neurología',
    date: '2026-02-12',
    time: '11:30',
    status: 'PENDING'
  },
];

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  IN_PROGRESS: 'En Curso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
  NO_SHOW: 'No Asistió'
};

const STATUS_COLORS: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  IN_PROGRESS: 'info',
  COMPLETED: 'default',
  CANCELLED: 'error',
  NO_SHOW: 'error'
};

export default function AppointmentsModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const filteredAppointments = SAMPLE_APPOINTMENTS.filter(apt => 
    apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.specialist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Gestión de Citas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra las citas médicas del sistema
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<CalendarMonthIcon />}
            size="large"
          >
            Ver Calendario
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
          >
            Nueva Cita
          </Button>
        </Stack>
      </Stack>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(_e, v) => setTabValue(v)}>
          <Tab label="Todas" />
          <Tab label="Hoy" />
          <Tab label="Pendientes" />
          <Tab label="Confirmadas" />
        </Tabs>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar citas..."
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
                <TableCell>Especialista</TableCell>
                <TableCell>Especialidad</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id} hover>
                  <TableCell>
                    <Typography fontWeight="medium">
                      {appointment.patient}
                    </Typography>
                  </TableCell>
                  <TableCell>{appointment.specialist}</TableCell>
                  <TableCell>{appointment.specialty}</TableCell>
                  <TableCell>
                    {new Date(appointment.date).toLocaleDateString('es-MX')}
                  </TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>
                    <Chip 
                      label={STATUS_LABELS[appointment.status]} 
                      color={STATUS_COLORS[appointment.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small">Ver Detalles</Button>
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
