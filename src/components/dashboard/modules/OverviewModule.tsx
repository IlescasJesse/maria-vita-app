/**
 * Módulo de Resumen - Dashboard Overview
 */

'use client';

import { useEffect, useState } from 'react';
import { Grid, Paper, Box, Typography, Card, CardContent, Stack, Chip, Divider, CircularProgress, TextField, Button, Alert } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScienceIcon from '@mui/icons-material/Science';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useAuth } from '@/hooks/useAuth';
import ClinicAvatar from '@/components/ClinicAvatar';

interface SpecialistProfileSummary {
  id?: string;
  fullName?: string;
  specialty?: string;
  licenseNumber?: string;
  assignedOffice?: string;
  biography?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
  photoUrl?: string;
  courses?: Array<{ title?: string; institution?: string; year?: number }>;
  certifications?: Array<{ title?: string; issuer?: string; year?: number }>;
  academicFormation?: Array<{ degree?: string; institution?: string; year?: number }>;
  trajectory?: Array<{ position?: string; institution?: string; startYear?: number; endYear?: number }>;
}

interface SpecialistProfileEditData {
  specialty: string;
  licenseNumber: string;
  assignedOffice: string;
  yearsOfExperience: string;
  consultationFee: string;
  biography: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
            {trend && (
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                <TrendingUpIcon fontSize="small" color="success" />
                <Typography variant="caption" color="success.main">
                  {trend}
                </Typography>
              </Stack>
            )}
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: `${color}15`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function OverviewModule() {
  const { user, isSuperAdmin, isAdmin } = useAuth();
  const [specialistProfile, setSpecialistProfile] = useState<SpecialistProfileSummary | null>(null);
  const [loadingSpecialistProfile, setLoadingSpecialistProfile] = useState(false);
  const [isEditingSpecialistProfile, setIsEditingSpecialistProfile] = useState(false);
  const [savingSpecialistProfile, setSavingSpecialistProfile] = useState(false);
  const [specialistError, setSpecialistError] = useState('');
  const [specialistSuccess, setSpecialistSuccess] = useState('');
  const [editData, setEditData] = useState<SpecialistProfileEditData>({
    specialty: '',
    licenseNumber: '',
    assignedOffice: '',
    yearsOfExperience: '',
    consultationFee: '',
    biography: '',
  });
  const isSpecialist = user?.role === 'SPECIALIST';

  const normalizeJsonArray = <T,>(value: unknown): T[] => {
    if (Array.isArray(value)) return value as T[];
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? (parsed as T[]) : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const parseNumberish = (value: string): number | undefined => {
    const cleaned = String(value || '').trim();
    if (!cleaned) return undefined;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const fillEditData = (profile: SpecialistProfileSummary) => {
    setEditData({
      specialty: profile.specialty || '',
      licenseNumber: profile.licenseNumber || '',
      assignedOffice: profile.assignedOffice || '',
      yearsOfExperience: profile.yearsOfExperience !== undefined && profile.yearsOfExperience !== null
        ? String(profile.yearsOfExperience)
        : '',
      consultationFee: profile.consultationFee !== undefined && profile.consultationFee !== null
        ? String(profile.consultationFee)
        : '',
      biography: profile.biography || '',
    });
  };

  const loadProfile = async () => {
    try {
      setLoadingSpecialistProfile(true);
      setSpecialistError('');

      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('No se pudo cargar el perfil del especialista');
      }

      const result = await response.json();
      const specialist = result?.data?.specialist;

      if (specialist) {
        const normalizedProfile: SpecialistProfileSummary = {
          ...specialist,
          courses: normalizeJsonArray<{ title?: string; institution?: string; year?: number }>(specialist.courses),
          certifications: normalizeJsonArray<{ title?: string; issuer?: string; year?: number }>(specialist.certifications),
          academicFormation: normalizeJsonArray<{ degree?: string; institution?: string; year?: number }>(specialist.academicFormation),
          trajectory: normalizeJsonArray<{ position?: string; institution?: string; startYear?: number; endYear?: number }>(specialist.trajectory),
        };

        setSpecialistProfile(normalizedProfile);
        fillEditData(normalizedProfile);
      }

      if (result?.data) {
        localStorage.setItem('user', JSON.stringify(result.data));
        window.dispatchEvent(new Event('user-updated'));
      }
    } catch (error) {
      setSpecialistError(error instanceof Error ? error.message : 'Error cargando perfil');
    } finally {
      setLoadingSpecialistProfile(false);
    }
  };

  const handleSaveSpecialistProfile = async () => {
    if (!specialistProfile?.id) {
      setSpecialistError('No se encontró el identificador del perfil de especialista');
      return;
    }

    if (!editData.specialty.trim()) {
      setSpecialistError('La especialidad es requerida');
      return;
    }

    if (!editData.licenseNumber.trim()) {
      setSpecialistError('La cédula profesional es requerida');
      return;
    }

    const yearsOfExperience = parseNumberish(editData.yearsOfExperience);
    const consultationFee = parseNumberish(editData.consultationFee);

    const payload = {
      specialty: editData.specialty.trim(),
      licenseNumber: editData.licenseNumber.trim(),
      assignedOffice: editData.assignedOffice.trim() || null,
      yearsOfExperience,
      consultationFee,
      biography: editData.biography.trim() || null,
      fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || specialistProfile.fullName || 'Especialista',
    };

    try {
      setSavingSpecialistProfile(true);
      setSpecialistError('');
      setSpecialistSuccess('');

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Sesión no válida. Vuelve a iniciar sesión');

      const response = await fetch(`/api/specialists/${specialistProfile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error?.message || 'No se pudo actualizar el perfil');
      }

      setSpecialistSuccess('Perfil actualizado correctamente');
      setIsEditingSpecialistProfile(false);
      await loadProfile();
    } catch (error) {
      setSpecialistError(error instanceof Error ? error.message : 'Error al guardar el perfil');
    } finally {
      setSavingSpecialistProfile(false);
    }
  };

  useEffect(() => {
    if (!isSpecialist) return;

    loadProfile();
  }, [isSpecialist]);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Resumen General
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Vista general del sistema Maria Vita
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {isSpecialist && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Mi Perfil Profesional
                </Typography>
                <Stack direction="row" spacing={1}>
                  {isEditingSpecialistProfile ? (
                    <>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setIsEditingSpecialistProfile(false);
                          if (specialistProfile) fillEditData(specialistProfile);
                          setSpecialistError('');
                        }}
                        disabled={savingSpecialistProfile}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSaveSpecialistProfile}
                        disabled={savingSpecialistProfile}
                      >
                        {savingSpecialistProfile ? 'Guardando...' : 'Guardar cambios'}
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsEditingSpecialistProfile(true);
                        setSpecialistError('');
                        setSpecialistSuccess('');
                        if (specialistProfile) fillEditData(specialistProfile);
                      }}
                    >
                      Editar perfil
                    </Button>
                  )}
                </Stack>
              </Stack>

              {specialistError && <Alert severity="error" sx={{ mb: 2 }}>{specialistError}</Alert>}
              {specialistSuccess && <Alert severity="success" sx={{ mb: 2 }}>{specialistSuccess}</Alert>}

              {loadingSpecialistProfile ? (
                <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress size={28} />
                </Box>
              ) : (
                <Grid container spacing={3} alignItems="flex-start">
                  <Grid item xs={12} md={4}>
                    <Stack spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ p: 2, borderRadius: 2, backgroundColor: 'background.default' }}>
                      <ClinicAvatar
                        firstName={user?.firstName}
                        lastName={user?.lastName}
                        photoUrl={specialistProfile?.photoUrl}
                        size="large"
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {user?.firstName} {user?.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user?.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    {isEditingSpecialistProfile ? (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            required
                            label="Especialidad"
                            value={editData.specialty}
                            onChange={(e) => setEditData(prev => ({ ...prev, specialty: e.target.value }))}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            required
                            label="Cédula profesional"
                            value={editData.licenseNumber}
                            onChange={(e) => setEditData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Consultorio"
                            value={editData.assignedOffice}
                            onChange={(e) => setEditData(prev => ({ ...prev, assignedOffice: e.target.value }))}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Años experiencia"
                            value={editData.yearsOfExperience}
                            onChange={(e) => setEditData(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Tarifa (MXN)"
                            value={editData.consultationFee}
                            onChange={(e) => setEditData(prev => ({ ...prev, consultationFee: e.target.value }))}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="Biografía"
                            value={editData.biography}
                            onChange={(e) => setEditData(prev => ({ ...prev, biography: e.target.value }))}
                          />
                        </Grid>
                      </Grid>
                    ) : (
                      <Stack spacing={1.5}>
                        <Typography variant="body2">
                          <strong>Especialidad:</strong> {specialistProfile?.specialty || 'Por definir'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Cédula profesional:</strong> {specialistProfile?.licenseNumber || 'Por definir'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Consultorio:</strong> {specialistProfile?.assignedOffice || 'Sin asignar'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Años de experiencia:</strong> {specialistProfile?.yearsOfExperience ?? 'Por definir'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Tarifa:</strong> {specialistProfile?.consultationFee !== undefined && specialistProfile?.consultationFee !== null
                            ? `$${specialistProfile.consultationFee} MXN`
                            : 'Por definir'}
                        </Typography>
                      </Stack>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip size="small" color="primary" label={`Formación: ${specialistProfile?.academicFormation?.length || 0}`} />
                      <Chip size="small" color="secondary" label={`Cursos: ${specialistProfile?.courses?.length || 0}`} />
                      <Chip size="small" color="success" label={`Certificaciones: ${specialistProfile?.certifications?.length || 0}`} />
                      <Chip size="small" color="info" label={`Trayectoria: ${specialistProfile?.trajectory?.length || 0}`} />
                    </Stack>

                    {specialistProfile?.biography && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Biografía
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {specialistProfile.biography}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              )}
            </Paper>
          </Grid>
        )}

        {/* Estadísticas principales */}
        {(isSuperAdmin || isAdmin) && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Usuarios"
                value="1,248"
                icon={<PeopleIcon fontSize="large" />}
                color="#1976d2"
                trend="+12% este mes"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Especialistas"
                value="48"
                icon={<LocalHospitalIcon fontSize="large" />}
                color="#2e7d32"
                trend="+3 nuevos"
              />
            </Grid>
          </>
        )}

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Citas Hoy"
            value="24"
            icon={<CalendarMonthIcon fontSize="large" />}
            color="#ed6c02"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Estudios Pendientes"
            value="16"
            icon={<ScienceIcon fontSize="large" />}
            color="#9c27b0"
          />
        </Grid>

        {/* Gráficas y estadísticas adicionales */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Citas por Mes
            </Typography>
            <Box
              sx={{
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey.50',
                borderRadius: 1
              }}
            >
              <Typography color="text.secondary">
                Gráfica de citas mensuales (próximamente)
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Actividad Reciente
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Nueva cita creada
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hace 5 minutos
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Estudio completado
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hace 15 minutos
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Nuevo paciente registrado
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hace 1 hora
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {isSuperAdmin && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, backgroundColor: 'error.light', color: 'error.contrastText' }}>
              <Typography variant="h6" gutterBottom>
                Panel de Super Administrador
              </Typography>
              <Typography variant="body2">
                Tienes acceso completo a todas las funcionalidades del sistema incluyendo
                gestión de administradores, configuración de base de datos y analíticas avanzadas.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
