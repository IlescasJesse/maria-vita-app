'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  BarChart as BarChartIcon,
  CheckCircle as CheckCircleIcon,
  PhotoCamera as PhotoCameraIcon,
  Lock as LockIconComponent,
} from '@mui/icons-material';
import ClinicAvatar from '@/components/ClinicAvatar';
import { completeAdminProfileSchema } from '@/lib/validations';

interface AdminProfileFormData {
  suffix?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  photoUrl?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const suffixes = ['Dr.', 'Dra.', 'Lic.', 'Ing.', 'Mtro.', 'Mtra.', 'C.P.', 'Enf.'];

export default function CompleteAdminProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [userRole, setUserRole] = useState<string>('');
  const [photoLoading, setPhotoLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [uploadedPhotoBase64, setUploadedPhotoBase64] = useState<string>('');

  const [formData, setFormData] = useState<AdminProfileFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    photoUrl: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role);
        setFormData(prev => ({
          ...prev,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
        }));
      } catch (err) {
        console.error('Error parseando usuario:', err);
      }
    }
    setLoading(false);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      const errors: Record<string, string> = {};
      if (!formData.firstName.trim()) errors.firstName = 'Requerido';
      if (!formData.lastName.trim()) errors.lastName = 'Requerido';

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
    }
    setError('');
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setActiveStep(prev => prev - 1);
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Selecciona una imagen valida');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedPhotoBase64(result);
      setFormData(prev => ({
        ...prev,
        photoUrl: result,
      }));
      setSuccess('Foto cargada correctamente');
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const enhancePhotoWithAI = async () => {
    if (!uploadedPhotoBase64) {
      setError('Primero sube una foto');
      return;
    }

    setPhotoLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/upload/enhance-profile-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          photoBase64: uploadedPhotoBase64,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const result = await response.json();
      if (response.ok && result.data?.photoUrl) {
        setFormData(prev => ({
          ...prev,
          photoUrl: result.data.photoUrl,
        }));
        setSuccess('✓ Foto guardada correctamente');
      } else {
        throw new Error(result.error?.message || 'Error guardando foto');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setError('');
    setFieldErrors({});

    try {
      // Validar con Zod
      const result = completeAdminProfileSchema.safeParse(formData);

      if (!result.success) {
        // Procesar errores de Zod
        const errors: Record<string, string> = {};
        result.error.errors.forEach((error) => {
          const path = error.path.join('.');
          errors[path] = error.message;
        });
        setFieldErrors(errors);

        // Mostrar primer error en el alert
        const firstError = result.error.errors[0];
        if (firstError) {
          setError(`⚠️ ${firstError.path.join('.')}: ${firstError.message}`);
        }
        setSubmitLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const { confirmPassword, ...dataToSend } = result.data;
      const cleanedDataToSend = Object.fromEntries(
        Object.entries(dataToSend).filter(([, value]) => {
          if (typeof value === 'string') {
            return value.trim() !== '';
          }
          return value !== undefined && value !== null;
        })
      );

      const response = await fetch('/api/auth/complete-admin-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedDataToSend),
      });

      const respData = await response.json();

      if (!response.ok) {
        if (Array.isArray(respData?.error?.details)) {
          const backendErrors: Record<string, string> = {};
          respData.error.details.forEach((detail: { field?: string; message?: string }) => {
            if (detail?.field && detail?.message && !backendErrors[detail.field]) {
              backendErrors[detail.field] = detail.message;
            }
          });
          if (Object.keys(backendErrors).length > 0) {
            setFieldErrors(backendErrors);
          }
        }
        throw new Error(respData.error?.message || 'Error al guardar');
      }

      setSuccess('✓ Perfil completado exitosamente');

      if (respData.data) {
        const updatedUser = {
          id: respData.data.id,
          email: respData.data.email,
          firstName: respData.data.firstName,
          lastName: respData.data.lastName,
          role: respData.data.role,
          phone: respData.data.phone,
          isActive: true,
          isNew: false,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('user-updated'));
      }

      setActiveStep(3);
    } catch (err: any) {
      setError(`❌ ${err.message || 'Error al completar el perfil'}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const steps = ['Informacion Personal', 'Foto de Perfil', 'Confirmacion', 'Tutorial'];

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3} color="primary.main">
              Informacion Personal
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Completa tus datos basicos para el sistema
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="suffix"
                  label="Titulo/Prefijo"
                  value={formData.suffix || ''}
                  onChange={handleInputChange}
                >
                  {suffixes.map(s => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} />

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  name="firstName"
                  label="Nombre"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onBlur={() => {
                    if (!formData.firstName.trim()) {
                      setFieldErrors(prev => ({ ...prev, firstName: 'Requerido' }));
                    }
                  }}
                  error={Boolean(fieldErrors.firstName)}
                  helperText={fieldErrors.firstName || ''}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  name="lastName"
                  label="Apellidos"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onBlur={() => {
                    if (!formData.lastName.trim()) {
                      setFieldErrors(prev => ({ ...prev, lastName: 'Requerido' }));
                    }
                  }}
                  error={Boolean(fieldErrors.lastName)}
                  helperText={fieldErrors.lastName || ''}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Teléfono"
                  type="tel"
                  placeholder="Ej: 5551234567"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  error={Boolean(fieldErrors.phone)}
                  helperText={fieldErrors.phone || 'Teléfono de 10 dígitos (opcional)'}
                />
              </Grid>

              {/* Sección de Contraseña */}
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" sx={{ mt: 2, mb: 1 }}>
                  <LockIconComponent sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" color="primary">
                    Establece tu Contraseña (Obligatoria)
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Por seguridad y privacidad, debes establecer una nueva contraseña. Debe contener mayúsculas,
                  minúsculas, números y un carácter especial (!@#$%^&*).
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="password"
                  name="newPassword"
                  label="Nueva Contraseña"
                  value={formData.newPassword || ''}
                  onChange={handleInputChange}
                  error={Boolean(fieldErrors.newPassword)}
                  helperText={fieldErrors.newPassword || 'Requerida'}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="password"
                  name="confirmPassword"
                  label="Confirmar Contraseña"
                  value={formData.confirmPassword || ''}
                  onChange={handleInputChange}
                  error={Boolean(fieldErrors.confirmPassword)}
                  helperText={fieldErrors.confirmPassword || 'Requerida'}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3} color="primary.main">
              Foto de Perfil
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Sube una foto tuya. Si no se carga, aparecerá tu avatar con los colores de la clínica
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box textAlign="center">
                  <ClinicAvatar
                    photoUrl={formData.photoUrl}
                    firstName={formData.firstName}
                    lastName={formData.lastName}
                    size="large"
                  />
                  {formData.photoUrl && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, photoUrl: '' }));
                        setUploadedPhotoBase64('');
                      }}
                      sx={{ mt: 2 }}
                    >
                      Cambiar foto
                    </Button>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCameraIcon />}
                  >
                    Subir foto
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handlePhotoFileChange}
                    />
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={enhancePhotoWithAI}
                    disabled={!uploadedPhotoBase64 || photoLoading}
                  >
                    {photoLoading ? 'Guardando...' : 'Guardar foto'}
                  </Button>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Acepta JPG, PNG y webp. Máximo 5MB
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3} color="primary.main">
              Resumen
            </Typography>

            <Card elevation={2}>
              <CardHeader avatar={<CheckCircleIcon sx={{ color: 'success.main', fontSize: 32 }} />} title="Datos" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Nombre Completo</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formData.suffix && `${formData.suffix} `}{formData.firstName} {formData.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Telefono</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formData.phone || 'No proporcioando'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Foto</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formData.photoUrl ? 'Configurada' : 'No configurada'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>


          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3} color="primary.main">
              Tutorial Rapido
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Las actividades que puedes hacer como administrador
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Box display="flex" alignItems="flex-start" gap={2} mb={3}>
                    <PeopleIcon sx={{ color: 'primary.main', fontSize: 32, mt: 0.5 }} />
                    <Box>
                      <Typography fontWeight="bold" gutterBottom>
                        1. Gestionar Usuarios
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        En el dashboard, ve a &quot;Usuarios&quot; - Crea, edita y elimina usuarios. Al crear, asigna permisos.
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="flex-start" gap={2} mb={3}>
                    <SecurityIcon sx={{ color: 'success.main', fontSize: 32, mt: 0.5 }} />
                    <Box>
                      <Typography fontWeight="bold" gutterBottom>
                        2. Gestionar Especialistas
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Administra perfiles medicos, especialidades y disponibilidad desde Especialistas.
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="flex-start" gap={2} mb={3}>
                    <BarChartIcon sx={{ color: 'info.main', fontSize: 32, mt: 0.5 }} />
                    <Box>
                      <Typography fontWeight="bold" gutterBottom>
                        3. Ver Reportes
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Accede a dashboards con estadisticas y exporta reportes del sistema.
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <SettingsIcon sx={{ color: 'warning.main', fontSize: 32, mt: 0.5 }} />
                    <Box>
                      <Typography fontWeight="bold" gutterBottom>
                        4. Configuracion
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Accede a configuraciones globales y ajustes del sistema.
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="success">
                  ¡Listo! Tu perfil esta completo. Ahora puedes gestionar el sistema.
                </Alert>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ minHeight: '100vh' }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h2" fontWeight="bold" color="primary.main" gutterBottom>
            Completar Perfil
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {userRole === 'SPECIALIST' ? 'Especialista Admin' : 'Administrador'}
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 400, mb: 4 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            {renderStepContent()}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Button disabled={activeStep === 0 || submitLoading} onClick={handleBack} variant="outlined">
              Atras
            </Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {activeStep === steps.length - 1 ? (
                <Button
                  onClick={() => router.push(userRole === 'SPECIALIST' ? '/dashboard/especialista' : '/dashboard')}
                  variant="contained"
                  size="large"
                >
                  Ir al Dashboard
                </Button>
              ) : (
                <Button
                  onClick={activeStep === 2 ? handleSubmit : handleNext}
                  variant="contained"
                  size="large"
                  disabled={submitLoading}
                >
                  {activeStep === 2 ? (submitLoading ? <CircularProgress size={24} /> : 'Completar') : 'Continuar'}
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>

    </Container>
  );
}
