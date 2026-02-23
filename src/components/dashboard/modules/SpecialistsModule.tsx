/**
 * Módulo de Gestión de Especialistas
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Box, Typography, Paper, Grid, Card, CardContent, CardActions,
  Button, Stack, TextField, InputAdornment, Chip, Avatar, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControlLabel, Switch, Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useOptimisticMutation } from '@/hooks/useOptimisticMutation';

interface Specialist {
  id: string;
  fullName: string;
  specialty: string;
  licenseNumber: string;
  consultationFee?: number | string | null;
  yearsOfExperience?: number | null;
  isAvailable: boolean;
}

interface SpecialistFormData {
  fullName: string;
  specialty: string;
  licenseNumber: string;
  consultationFee: string;
  yearsOfExperience: string;
  isAvailable: boolean;
}

const DEFAULT_FORM: SpecialistFormData = {
  fullName: '',
  specialty: '',
  licenseNumber: '',
  consultationFee: '',
  yearsOfExperience: '',
  isAvailable: true,
};

export default function SpecialistsModule() {
  const { runOptimistic } = useOptimisticMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingSpecialist, setEditingSpecialist] = useState<Specialist | null>(null);
  const [formData, setFormData] = useState<SpecialistFormData>(DEFAULT_FORM);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadSpecialists = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/specialists');
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error?.message || data?.message || 'Error al cargar especialistas');
      }

      const incoming = Array.isArray(data?.data) ? data.data : [];
      setSpecialists(incoming);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Error al cargar especialistas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpecialists();
  }, []);

  const filteredSpecialists = useMemo(
    () => specialists.filter((specialist) =>
      specialist.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [specialists, searchTerm]
  );

  const openEdit = (specialist: Specialist) => {
    setEditingSpecialist(specialist);
    setFormData({
      fullName: specialist.fullName || '',
      specialty: specialist.specialty || '',
      licenseNumber: specialist.licenseNumber || '',
      consultationFee: specialist.consultationFee != null ? String(specialist.consultationFee) : '',
      yearsOfExperience: specialist.yearsOfExperience != null ? String(specialist.yearsOfExperience) : '',
      isAvailable: Boolean(specialist.isAvailable),
    });
    setOpenEditDialog(true);
    setError('');
  };

  const closeEdit = () => {
    if (!saving) {
      setOpenEditDialog(false);
      setEditingSpecialist(null);
      setFormData(DEFAULT_FORM);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingSpecialist) return;

    if (!formData.fullName.trim() || !formData.specialty.trim() || !formData.licenseNumber.trim()) {
      setError('Nombre completo, especialidad y cédula son obligatorios');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const payload = {
        fullName: formData.fullName.trim(),
        specialty: formData.specialty.trim(),
        licenseNumber: formData.licenseNumber.trim(),
        consultationFee: formData.consultationFee ? Number(formData.consultationFee) : undefined,
        yearsOfExperience: formData.yearsOfExperience ? Number(formData.yearsOfExperience) : undefined,
        isAvailable: formData.isAvailable,
      };

      const previous = editingSpecialist;
      const optimisticUpdated: Specialist = {
        ...editingSpecialist,
        ...payload,
      };

      closeEdit();

      const result = await runOptimistic({
        applyOptimistic: () => {
          setSpecialists((prev) => prev.map((item) => (item.id === previous.id ? optimisticUpdated : item)));
          return { previous };
        },
        rollback: (context) => {
          setSpecialists((prev) => prev.map((item) => (item.id === context.previous.id ? context.previous : item)));
        },
        mutation: async () => {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/specialists/${previous.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(data?.error?.message || data?.message || 'Error al actualizar especialista');
          }

          return data;
        },
        onSuccess: (data, context) => {
          if (data?.data?.id) {
            setSpecialists((prev) => prev.map((item) => (item.id === context.previous.id ? data.data : item)));
          }
        },
        onError: (submitError, context) => {
          openEdit(context.previous);
          setError(submitError instanceof Error ? submitError.message : 'Error al actualizar especialista');
        },
      });

      if (!result.ok) return;

      setSuccess('Especialista actualizado exitosamente');
      setTimeout(() => setSuccess(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSpecialist = async (specialist: Specialist) => {
    try {
      setSaving(true);
      setError('');

      const previous = [...specialists];
      const previousIndex = previous.findIndex((item) => item.id === specialist.id);

      const result = await runOptimistic({
        applyOptimistic: () => {
          setSpecialists((prev) => prev.filter((item) => item.id !== specialist.id));
          return { previous, previousIndex };
        },
        rollback: (context) => {
          setSpecialists(context.previous);
        },
        mutation: async () => {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/specialists/${specialist.id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(data?.error?.message || data?.message || 'Error al eliminar especialista');
          }

          return data;
        },
        onError: (deleteError) => {
          setError(deleteError instanceof Error ? deleteError.message : 'Error al eliminar especialista');
        },
      });

      if (!result.ok) return;

      setSuccess('Especialista eliminado exitosamente');
      setTimeout(() => setSuccess(''), 4000);
      if (previousIndex === 0) {
        loadSpecialists();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

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
          disabled
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
        {loading && (
          <Grid item xs={12}>
            <Typography color="text.secondary">Cargando especialistas...</Typography>
          </Grid>
        )}
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
                <Button size="small" startIcon={<EditIcon />} onClick={() => openEdit(specialist)}>
                  Editar
                </Button>
                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteSpecialist(specialist)}>
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openEditDialog} onClose={closeEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Editar especialista</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre completo"
              value={formData.fullName}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Especialidad"
              value={formData.specialty}
              onChange={(e) => setFormData((prev) => ({ ...prev, specialty: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Cédula"
              value={formData.licenseNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, licenseNumber: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Años de experiencia"
              type="number"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData((prev) => ({ ...prev, yearsOfExperience: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Costo consulta (MXN)"
              type="number"
              value={formData.consultationFee}
              onChange={(e) => setFormData((prev) => ({ ...prev, consultationFee: e.target.value }))}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isAvailable: e.target.checked }))}
                />
              }
              label="Disponible"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit} disabled={saving}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
