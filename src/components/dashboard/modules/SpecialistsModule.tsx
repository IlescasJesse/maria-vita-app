/**
 * Módulo de Gestión de Especialistas
 */

'use client';

import { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Card, CardContent, CardActions,
  Button, Stack, TextField, InputAdornment, Chip, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

const SAMPLE_SPECIALISTS = [
  { 
    id: '1', 
    fullName: 'Dr. Juan Pérez', 
    specialty: 'Cardiología', 
    licenseNumber: 'LIC-CARD-001',
    consultationFee: 1500,
    yearsOfExperience: 15,
    isAvailable: true
  },
  { 
    id: '2', 
    fullName: 'Dra. Ana Martínez', 
    specialty: 'Radiología', 
    licenseNumber: 'LIC-RAD-001',
    consultationFee: 2000,
    yearsOfExperience: 10,
    isAvailable: true
  },
  { 
    id: '3', 
    fullName: 'Dr. Pedro González', 
    specialty: 'Medicina General', 
    licenseNumber: 'LIC-GP-001',
    consultationFee: 800,
    yearsOfExperience: 8,
    isAvailable: true
  },
  { 
    id: '4', 
    fullName: 'Dr. Miguel Rodríguez', 
    specialty: 'Neurología', 
    licenseNumber: 'LIC-NEU-001',
    consultationFee: 1800,
    yearsOfExperience: 12,
    isAvailable: false
  },
];

export default function SpecialistsModule() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpecialists = SAMPLE_SPECIALISTS.filter(specialist => 
    specialist.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    specialist.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Especialistas Médicos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona el equipo médico y sus especialidades
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
        >
          Nuevo Especialista
        </Button>
      </Stack>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar especialistas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Grid container spacing={3}>
        {filteredSpecialists.map((specialist) => (
          <Grid item xs={12} sm={6} md={4} key={specialist.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                    {specialist.fullName.charAt(0)}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight="bold">
                      {specialist.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {specialist.specialty}
                    </Typography>
                  </Box>
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Cédula:</strong> {specialist.licenseNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Experiencia:</strong> {specialist.yearsOfExperience} años
                  </Typography>
                  <Typography variant="body2">
                    <strong>Consulta:</strong> ${specialist.consultationFee} MXN
                  </Typography>
                  <Chip 
                    label={specialist.isAvailable ? 'Disponible' : 'No disponible'}
                    color={specialist.isAvailable ? 'success' : 'default'}
                    size="small"
                    sx={{ mt: 1, alignSelf: 'flex-start' }}
                  />
                </Stack>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<VisibilityIcon />}>
                  Ver Perfil
                </Button>
                <Button size="small" startIcon={<EditIcon />}>
                  Editar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
