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
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  PhotoCamera,
  Add as AddIcon,
  Delete as DeleteIcon,
  AutoAwesome as AIIcon,
  LocalHospital as LocalHospitalIcon,
  GroupWork as GroupWorkIcon,
  Favorite as FavoriteIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

interface ProfileFormData {
  // Datos básicos (todos los roles)
  suffix?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phone?: number;
  newPassword?: string;
  confirmPassword?: string;

  // Datos de especialista
  specialty?: string;
  licenseNumber?: string;
  assignedOffice?: string;
  biography?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
  photoUrl?: string;
  courses?: { title: string; institution: string; year: number }[];
  certifications?: { title: string; issuer: string; year: number }[];
  academicFormation?: { degree: string; institution: string; year: number }[];
  trajectory?: { position: string; institution: string; startYear: number; endYear?: number }[];
}

const suffixes = ['Dr.', 'Dra.', 'Lic.', 'Ing.', 'Mtro.', 'Mtra.', 'C.P.', 'Enf.'];

export default function CompletarPerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [userRole, setUserRole] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    courses: [],
    certifications: [],
    academicFormation: [],
    trajectory: [],
  });

  // Solo verificar autenticació básica - NO redirects automáticos
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    
    // Cargar datos del usuario sin verificar isNew
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserId(user.id);
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

  const steps = userRole === 'SPECIALIST' 
    ? ['Bienvenida', 'Nuestro Compromiso', 'Datos Personales', 'Información Profesional', 'Formación y Experiencia', 'Foto de Perfil']
    : ['Bienvenida', 'Nuestro Compromiso', 'Datos Personales', 'Contacto'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (field: keyof ProfileFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: 'courses' | 'certifications' | 'academicFormation' | 'trajectory') => {
    const newItem = field === 'trajectory' 
      ? { position: '', institution: '', startYear: new Date().getFullYear() }
      : { title: '', institution: '', year: new Date().getFullYear() };
    
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), newItem],
    }));
  };

  const updateArrayItem = (
    field: 'courses' | 'certifications' | 'academicFormation' | 'trajectory',
    index: number,
    key: string,
    value: any
  ) => {
    setFormData(prev => {
      const array = [...(prev[field] || [])];
      if (array[index]) {
        array[index] = { ...array[index], [key]: value };
      }
      return { ...prev, [field]: array };
    });
  };

  const removeArrayItem = (
    field: 'courses' | 'certifications' | 'academicFormation' | 'trajectory',
    index: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('photo', file);
      formDataUpload.append('userId', userId);

      const response = await fetch('/api/upload/profile-photo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formDataUpload,
      });

      if (!response.ok) throw new Error('Error al subir foto');

      const data = await response.json();
      handleChange('photoUrl', data.photoUrl);
      setSuccess('Foto subida correctamente');
    } catch (err) {
      setError('Error al subir la foto');
    } finally {
      setLoading(false);
    }
  };

  const handleAIPhotoGeneration = async () => {
    // TODO: Implementar integración con IA para generar foto profesional
    setError('Funcionalidad de IA en desarrollo - próximamente disponible');
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Validaciones
      if (!formData.firstName || !formData.lastName) {
        setError('Por favor completa todos los campos requeridos');
        setLoading(false);
        return;
      }

      if (!formData.newPassword) {
        setError('Por favor establece una contraseña para tu cuenta');
        setLoading(false);
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }

      // Validar formato de contraseña
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(formData.newPassword)) {
        setError('La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial (!@#$%^&*)');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      
      // Preparar datos para enviar (sin confirmPassword)
      const { confirmPassword, ...dataToSend } = formData;

      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error al guardar perfil');
      }

      const result = await response.json();
      
      // CRÍTICO: Actualizar localStorage con el usuario que tiene isNew=false
      // Esto previene el loop infinito entre dashboard y completar-perfil
      if (result.success && result.data) {
        const updatedUser = {
          id: result.data.id,
          email: result.data.email,
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          role: result.data.role,
          phone: result.data.phone,
          isActive: true,
          isNew: result.data.isNew // Este ahora es 0/false
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Disparar evento para que useAuth se actualice
        window.dispatchEvent(new Event('user-updated'));
      }

      setSuccess('¡Perfil completado exitosamente! Tu contraseña ha sido establecida.');
      setTimeout(() => {
        // Redirección directa sin más verificaciones
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al completar el perfil. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Primera Bienvenida
        return (
          <Box textAlign="center" py={4}>
            <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>
              ¡Bienvenido a Clínica María Vita!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 3, mb: 4 }}>
              Es un honor contar con profesionales como usted en nuestro equipo
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}>
              En María Vita creemos que la excelencia médica comienza con personas comprometidas, 
              capaces y dedicadas al bienestar de nuestros pacientes. Su experiencia y profesionalismo 
              son fundamentales para continuar brindando atención de la más alta calidad.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                "La medicina es una ciencia de la incertidumbre y un arte de la probabilidad."
              </Typography>
              <Typography variant="caption" color="text.secondary">
                - William Osler
              </Typography>
            </Box>
          </Box>
        );

      case 1: // Nuestro Compromiso
        return (
          <Box textAlign="center" py={4}>
            <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
              Nuestro Compromiso con Usted
            </Typography>
            <Grid container spacing={3} sx={{ mt: 3, maxWidth: 700, mx: 'auto' }}>
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                    <LocalHospitalIcon sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Excelencia Médica
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    Le proporcionamos las mejores herramientas y recursos para que pueda 
                    ejercer su profesión con la máxima calidad y seguridad.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                    <GroupWorkIcon sx={{ mr: 1, fontSize: 28, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      Trabajo en Equipo
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Fomentamos un ambiente colaborativo donde cada miembro del equipo 
                    es valorado y respetado por su contribución profesional.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 3, bgcolor: 'secondary.light' }}>
                  <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                    <FavoriteIcon sx={{ mr: 1, fontSize: 28, color: 'secondary.main' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Cuidado Humano
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    Más allá de la técnica, cultivamos un enfoque humano y empático 
                    hacia cada paciente que confía en nosotros.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            <Typography variant="body1" sx={{ mt: 4, fontWeight: 'medium' }}>
              A continuación, le pedimos completar su perfil profesional para comenzar.
            </Typography>
          </Box>
        );

      case 2: // Datos Personales
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Sufijo"
                value={formData.suffix || ''}
                onChange={(e) => handleChange('suffix', e.target.value)}
              >
                <MenuItem value="">Ninguno</MenuItem>
                {suffixes.map((suffix) => (
                  <MenuItem key={suffix} value={suffix}>{suffix}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Nombre(s)"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Apellidos"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Nacimiento"
                InputLabelProps={{ shrink: true }}
                value={formData.dateOfBirth || ''}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </Grid>
            
            {/* Sección de Contraseña */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" sx={{ mt: 2, mb: 1 }}>
                <LockIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" color="primary">
                  Establece tu Contraseña
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Crea una contraseña segura para tu cuenta. Debe contener al menos 8 caracteres, 
                incluyendo mayúsculas, minúsculas, números y un carácter especial.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="password"
                label="Nueva Contraseña"
                value={formData.newPassword || ''}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                helperText="Mínimo 8 caracteres con mayúsculas, minúsculas, números y símbolos"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="password"
                label="Confirmar Contraseña"
                value={formData.confirmPassword || ''}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                error={formData.confirmPassword !== '' && formData.newPassword !== formData.confirmPassword}
                helperText={
                  formData.confirmPassword !== '' && formData.newPassword !== formData.confirmPassword
                    ? 'Las contraseñas no coinciden'
                    : 'Repite la contraseña para confirmar'
                }
              />
            </Grid>
          </Grid>
        );

      case 3: // Información Profesional (solo especialistas)
        if (userRole !== 'SPECIALIST') return null;
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Especialidad"
                value={formData.specialty || ''}
                onChange={(e) => handleChange('specialty', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Cédula Profesional"
                value={formData.licenseNumber || ''}
                onChange={(e) => handleChange('licenseNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Consultorio Asignado"
                value={formData.assignedOffice || ''}
                onChange={(e) => handleChange('assignedOffice', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Años de Experiencia"
                value={formData.yearsOfExperience || ''}
                onChange={(e) => handleChange('yearsOfExperience', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Tarifa de Consulta (MXN)"
                value={formData.consultationFee || ''}
                onChange={(e) => handleChange('consultationFee', parseFloat(e.target.value))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Biografía / Descripción de Trayectoria"
                placeholder="Describe brevemente tu experiencia profesional..."
                value={formData.biography || ''}
                onChange={(e) => handleChange('biography', e.target.value)}
              />
            </Grid>
          </Grid>
        );

      case 4: // Formación y Experiencia (solo especialistas)
        if (userRole !== 'SPECIALIST') return null;
        return (
          <Box>
            {/* Formación Académica */}
            <Typography variant="h6" gutterBottom>Formación Académica</Typography>
            {(formData.academicFormation || []).map((item, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Título/Grado"
                    value={item.degree || ''}
                    onChange={(e) => updateArrayItem('academicFormation', index, 'degree', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Institución"
                    value={item.institution || ''}
                    onChange={(e) => updateArrayItem('academicFormation', index, 'institution', e.target.value)}
                  />
                </Grid>
                <Grid item xs={10} sm={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Año"
                    value={item.year || ''}
                    onChange={(e) => updateArrayItem('academicFormation', index, 'year', parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={2} sm={1}>
                  <IconButton color="error" onClick={() => removeArrayItem('academicFormation', index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<AddIcon />} onClick={() => addArrayItem('academicFormation')}>
              Agregar Formación
            </Button>

            {/* Certificaciones */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Certificaciones</Typography>
            {(formData.certifications || []).map((item, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Certificación"
                    value={item.title || ''}
                    onChange={(e) => updateArrayItem('certifications', index, 'title', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Emisor"
                    value={item.issuer || ''}
                    onChange={(e) => updateArrayItem('certifications', index, 'issuer', e.target.value)}
                  />
                </Grid>
                <Grid item xs={10} sm={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Año"
                    value={item.year || ''}
                    onChange={(e) => updateArrayItem('certifications', index, 'year', parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={2} sm={1}>
                  <IconButton color="error" onClick={() => removeArrayItem('certifications', index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<AddIcon />} onClick={() => addArrayItem('certifications')}>
              Agregar Certificación
            </Button>

            {/* Cursos */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Cursos</Typography>
            {(formData.courses || []).map((item, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Curso"
                    value={item.title || ''}
                    onChange={(e) => updateArrayItem('courses', index, 'title', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Institución"
                    value={item.institution || ''}
                    onChange={(e) => updateArrayItem('courses', index, 'institution', e.target.value)}
                  />
                </Grid>
                <Grid item xs={10} sm={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Año"
                    value={item.year || ''}
                    onChange={(e) => updateArrayItem('courses', index, 'year', parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={2} sm={1}>
                  <IconButton color="error" onClick={() => removeArrayItem('courses', index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<AddIcon />} onClick={() => addArrayItem('courses')}>
              Agregar Curso
            </Button>

            {/* Trayectoria */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Trayectoria Profesional</Typography>
            {(formData.trajectory || []).map((item, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Cargo/Posición"
                    value={item.position || ''}
                    onChange={(e) => updateArrayItem('trajectory', index, 'position', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Institución"
                    value={item.institution || ''}
                    onChange={(e) => updateArrayItem('trajectory', index, 'institution', e.target.value)}
                  />
                </Grid>
                <Grid item xs={5} sm={1.5}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Desde"
                    value={item.startYear || ''}
                    onChange={(e) => updateArrayItem('trajectory', index, 'startYear', parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={5} sm={1.5}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Hasta"
                    placeholder="Actual"
                    value={item.endYear || ''}
                    onChange={(e) => updateArrayItem('trajectory', index, 'endYear', parseInt(e.target.value) || undefined)}
                  />
                </Grid>
                <Grid item xs={2} sm={1}>
                  <IconButton color="error" onClick={() => removeArrayItem('trajectory', index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<AddIcon />} onClick={() => addArrayItem('trajectory')}>
              Agregar Experiencia
            </Button>
          </Box>
        );

      case 5: // Foto de Perfil (solo especialistas)
        if (userRole !== 'SPECIALIST') return null;
        return (
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom>Foto de Perfil Profesional</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sube una foto tuya de frente o genera una con IA
            </Typography>

            <Box display="flex" justifyContent="center" mb={3}>
              <Avatar
                src={formData.photoUrl}
                sx={{ width: 200, height: 200, border: '4px solid', borderColor: 'primary.main' }}
              />
            </Box>

            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  Subir Foto
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AIIcon />}
                  onClick={handleAIPhotoGeneration}
                  disabled
                >
                  Generar con IA (Próximamente)
                </Button>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Próximamente:</strong> Genera una foto profesional con IA usando tu foto casual.
                La IA te colocará con bata blanca y fondo en colores María Vita.
              </Typography>
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary.main">
          Completa tu Perfil
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Antes de acceder al sistema, por favor completa tu información de perfil
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 4 }}>
          {renderStepContent()}
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Atrás
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Completar Perfil'}
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleNext}
              disabled={
                activeStep === 2 && (
                  !formData.firstName || 
                  !formData.lastName || 
                  !formData.newPassword || 
                  !formData.confirmPassword ||
                  formData.newPassword !== formData.confirmPassword
                )
              }
            >
              {activeStep < 2 ? 'Continuar' : 'Siguiente'}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
