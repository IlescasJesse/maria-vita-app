/**
 * Módulo de Gestión de Usuarios
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  Skeleton,
  Backdrop,
  CircularProgress,
  InputBase,
  FormHelperText,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';


interface User {
  id: string;
  email: string;
  role: string;
  suffix?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  isNew: boolean;
  createdAt: string;
}

const roles = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'SPECIALIST', label: 'Especialista' },
  { value: 'RECEPTIONIST', label: 'Recepcionista' },
  { value: 'PATIENT', label: 'Paciente' },
];

const suffixes = ['Dr.', 'Dra.', 'Lic.', 'Ing.', 'Mtro.', 'Mtra.', 'C.P.', 'Enf.'];

const adminPermissions = [
  { label: 'Gestionar Usuarios', value: 'manageUsers' },
  { label: 'Gestionar Especialistas', value: 'manageSpecialists' },
  { label: 'Ver Reportes', value: 'manageReports' },
  { label: 'Configuracion del Sistema', value: 'manageSettings' },
];

// Helper para renderizar email con estilos divididos
const renderEmailWithStyle = (email: string) => {
  const parts = email.split('@');
  if (parts.length !== 2) return <span>{email}</span>;
  
  return (
    <Box component="span">
      <Box component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>
        {parts[0]}
      </Box>
      <Box component="span" sx={{ fontWeight: 300, color: 'text.secondary', fontSize: '0.875em' }}>
        @{parts[1]}
      </Box>
    </Box>
  );
};

// Configuración de colores para roles con semántica asertiva
const getRoleColor = (role: string): 'error' | 'warning' | 'info' | 'success' | 'primary' | 'secondary' | 'default' => {
  switch (role) {
    case 'SUPERADMIN': return 'error';      // Rojo: Máximo poder/peligro
    case 'ADMIN': return 'warning';          // Naranja: Administración
    case 'SPECIALIST': return 'info';        // Azul: Profesional médico
    case 'STAFF': return 'primary';          // Púrpura: Personal de apoyo
    case 'RECEPTIONIST': return 'primary';   // Púrpura: Recepcionista
    case 'PATIENT': return 'secondary';      // Gris: Usuario estándar
    default: return 'default';
  }
};

export default function UsersModule() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    email: '',
    role: 'PATIENT',
    suffix: '',
    firstName: '',
    lastName: '',
    phone: '',
    isActive: true,
    tempPassword: '',
    adminPermissions: [] as string[],
  });

  const [emailLocalPart, setEmailLocalPart] = useState('');

  const validateField = useCallback((field: string, value: string) => {
    switch (field) {
      case 'email': {
        if (editingUser) return '';
        const emailValue = (value || '').trim();
        if (!emailValue) return 'El email es requerido';
        if (emailValue.includes('@ADMIN') || emailValue.includes('@admin')) return '';
        if (emailValue.includes('@')) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(emailValue) ? '' : 'Email no válido';
        }
        return '';
      }
      case 'role':
        return value ? '' : 'El rol es requerido';
      case 'tempPassword':
        if (editingUser) return '';
        if (!value) return 'La contraseña temporal es requerida';
        return value.length >= 6 ? '' : 'La contraseña debe tener al menos 6 caracteres';
      case 'firstName': {
        const trimmed = value.trim();
        if (!trimmed) return '';
        return trimmed.length >= 2 ? '' : 'El nombre debe tener al menos 2 caracteres';
      }
      case 'lastName':
        return value.length <= 100 ? '' : 'Los apellidos no pueden superar 100 caracteres';
      case 'phone':
        return value && !/^\d+$/.test(value) ? 'El teléfono debe ser numérico' : '';
      default:
        return '';
    }
  }, [editingUser]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al cargar usuarios' }));
        throw new Error(errorData.error?.message || errorData.message || 'Error al cargar usuarios');
      }

      const data = await response.json();
      // Extraer el array de usuarios del objeto respuesta
      setUsers(Array.isArray(data) ? data : data.data || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = useCallback((user?: User) => {
    setFieldErrors({});
    if (user) {
      setEditingUser(user);
      const localPart = user.email.split('@')[0] || '';
      setEmailLocalPart(localPart);
      setFormData({
        email: user.email,
        role: user.role,
        suffix: user.suffix || '',
        firstName: user.firstName,
        lastName: user.lastName || '',
        phone: user.phone || '',
        isActive: user.isActive,
        tempPassword: '',
        adminPermissions: [],
      });
    } else {
      setEditingUser(null);
      setEmailLocalPart('');
      setFormData({
        email: '',
        role: 'PATIENT',
        suffix: '',
        firstName: '',
        lastName: '',
        phone: '',
        isActive: true,
        tempPassword: '',
        adminPermissions: [],
      });
    }
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingUser(null);
    setError('');
    setFieldErrors({});
  }, []);

  const handleChange = useCallback((field: string, value: any) => {
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    if (field === 'email') {
      if (value.includes('@ADMIN') || value.includes('@admin')) {
        setFormData(prev => ({ ...prev, [field]: value }));
        setEmailLocalPart(value);
        return;
      }
      const localPart = value.split('@')[0];
      setEmailLocalPart(localPart);
      if (value.includes('@')) {
        setFormData(prev => ({ ...prev, [field]: `${localPart}@maria-vita.mx` }));
      } else {
        setFormData(prev => ({ ...prev, [field]: localPart }));
      }
    } else if (field === 'adminPermissions') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  }, []);

  const handleBlur = useCallback((field: string, value: any) => {
    const fieldValue = typeof value === 'string' ? value : String(value ?? '');
    setFieldErrors((prev) => ({ ...prev, [field]: validateField(field, fieldValue) }));
  }, [validateField]);

  const handleSubmit = async () => {
    try {
      setError('');
      setSaving(true);
      setFieldErrors({});
      const token = localStorage.getItem('token');

      const endpoint = editingUser
        ? `/api/users/${editingUser.id}`
        : '/api/users/create';

      const method = editingUser ? 'PUT' : 'POST';

      const nextFieldErrors: Record<string, string> = {};

      // Asegurar que el email tenga el dominio completo para emails normales
      let finalEmail = formData.email;
      if (!editingUser) {
        if (!finalEmail) {
          finalEmail = emailLocalPart;
        }

        if (!finalEmail) {
          nextFieldErrors.email = 'El email es requerido';
        } else if (!finalEmail.includes('@')) {
          finalEmail = `${finalEmail}@maria-vita.mx`;
        } else if (!finalEmail.includes('@ADMIN') && !finalEmail.includes('@admin') && !finalEmail.includes('@maria-vita.mx')) {
          const localPart = finalEmail.split('@')[0];
          finalEmail = `${localPart}@maria-vita.mx`;
        }

        if (finalEmail) {
          if (!finalEmail.includes('@ADMIN') && !finalEmail.includes('@admin')) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(finalEmail)) {
              nextFieldErrors.email = 'Email no válido';
            }
          }
        }
      }

      if (!formData.role) {
        nextFieldErrors.role = 'El rol es requerido';
      }

      if (!editingUser && !formData.tempPassword) {
        nextFieldErrors.tempPassword = 'La contraseña temporal es requerida';
      }

      if (formData.firstName && formData.firstName.trim().length < 2) {
        nextFieldErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
      }

      if (formData.lastName && formData.lastName.trim().length > 100) {
        nextFieldErrors.lastName = 'Los apellidos no pueden superar 100 caracteres';
      }

      if (formData.phone && !/^\d+$/.test(formData.phone)) {
        nextFieldErrors.phone = 'El teléfono debe ser numérico';
      }

      if (Object.values(nextFieldErrors).some(Boolean)) {
        setFieldErrors(nextFieldErrors);
        setSaving(false);
        return;
      }

      const body: any = {
        role: formData.role,
        suffix: formData.suffix || null,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        phone: formData.phone || '',
        isActive: formData.isActive,
      };

      // Solo incluir email en creación (no se puede editar)
      if (!editingUser) {
        body.email = finalEmail;
      }

      // Solo incluir password en creación
      if (!editingUser && formData.tempPassword) {
        body.tempPassword = formData.tempPassword;
      }

      // Incluir permisos si es admin
      if (formData.role === 'ADMIN' && formData.adminPermissions.length > 0) {
        body.adminPermissions = formData.adminPermissions;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || errorData.message || 'Error al guardar usuario');
      }

      setSuccess(editingUser ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
      handleCloseDialog();
      loadUsers();
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar usuario');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || errorData.message || 'Error al eliminar usuario');
      }

      setSuccess('Usuario eliminado exitosamente');
      setOpenDeleteDialog(false);
      setUserToDelete(null);
      loadUsers();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar usuario');
      setOpenDeleteDialog(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenDeleteDialog = useCallback((user: User) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    if (!deleting) {
      setOpenDeleteDialog(false);
      setUserToDelete(null);
    }
  }, [deleting]);

  const getRoleLabel = useCallback((role: string) => {
    return roles.find(r => r.value === role)?.label || role;
  }, []);

  const filteredUsers = useMemo(
    () => users.filter((user) => user.role !== 'SUPERADMIN'),
    [users]
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Gestión de Usuarios
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Crear Usuario
        </Button>
      </Box>
      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Nombre</strong></TableCell>
                  <TableCell><strong>Rol</strong></TableCell>
                  <TableCell><strong>Estado</strong></TableCell>
                  <TableCell><strong>Perfil</strong></TableCell>
                  <TableCell align="right"><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                      <TableCell><Skeleton variant="text" width="70%" /></TableCell>
                      <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                      <TableCell><Skeleton variant="rounded" width={70} height={24} /></TableCell>
                      <TableCell><Skeleton variant="rounded" width={90} height={24} /></TableCell>
                      <TableCell align="right">
                        <Skeleton variant="circular" width={32} height={32} sx={{ display: 'inline-block', mr: 1 }} />
                        <Skeleton variant="circular" width={32} height={32} sx={{ display: 'inline-block' }} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        No hay usuarios registrados
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{renderEmailWithStyle(user.email)}</TableCell>
                      <TableCell>
                        {user.suffix && `${user.suffix} `}
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getRoleLabel(user.role)}
                          color={getRoleColor(user.role)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Activo' : 'Inactivo'}
                          color={user.isActive ? 'success' : 'error'}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            ...(user.isActive ? {} : { opacity: 0.8 })
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isNew ? 'Incompleto' : 'Completo'}
                          color={user.isNew ? 'warning' : 'success'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(user)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDeleteDialog(user)}
                          disabled={user.role === 'SUPERADMIN'}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog para Crear/Editar Usuario */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </DialogTitle>
        <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Email <Typography component="span" color="error">*</Typography>
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      border: '1.5px solid',
                      borderColor: fieldErrors.email ? '#d32f2f' : '#ccc',
                      borderRadius: '4px',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden',
                      backgroundColor: editingUser ? '#f5f5f5' : '#fff',
                      '&:hover': !editingUser ? {
                        borderColor: '#999',
                      } : {},
                      '&:focus-within': !editingUser ? {
                        borderColor: '#00875F',
                        borderWidth: '2.5px',
                        boxShadow: '0 0 0 3px rgba(0, 135, 95, 0.1)',
                      } : {},
                    }}
                  >
                    <InputBase
                      fullWidth
                      placeholder="nombre.apellido"
                      value={emailLocalPart}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={(e) => handleBlur('email', e.target.value)}
                      disabled={!!editingUser}
                      sx={{
                        flex: 1,
                        px: 2,
                        py: 1.5,
                        fontSize: '1rem',
                        '& input::placeholder': {
                          color: '#999',
                          opacity: 0.7,
                        },
                        '& input:disabled': {
                          color: '#666',
                          WebkitTextFillColor: '#666',
                        },
                      }}
                    />
                    {!emailLocalPart.includes('@') && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          px: 2,
                          backgroundColor: '#E8F5F0',
                          borderLeft: '1px solid #ccc',
                          minWidth: 'auto',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            color: '#00875F',
                            fontWeight: 500,
                          }}
                        >
                          @maria-vita.mx
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <FormHelperText
                    error={Boolean(fieldErrors.email)}
                    sx={{ mt: 1 }}
                  >
                    {fieldErrors.email
                      ? fieldErrors.email
                      : !editingUser && !emailLocalPart.includes('@')
                      ? 'El dominio @maria-vita.mx se agregará automáticamente (excepto para @ADMIN)'
                      : editingUser
                      ? 'No se puede modificar el email de usuarios existentes'
                      : ''}
                  </FormHelperText>
                </Box>
              </Grid>

              {!editingUser && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Contraseña Temporal"
                    type="password"
                    value={formData.tempPassword}
                    onChange={(e) => handleChange('tempPassword', e.target.value)}
                    onBlur={(e) => handleBlur('tempPassword', e.target.value)}
                    error={Boolean(fieldErrors.tempPassword)}
                    helperText={fieldErrors.tempPassword || 'El usuario deberá cambiarla al completar su perfil'}
                    margin="normal"
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Rol"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  onBlur={(e) => handleBlur('role', e.target.value)}
                  error={Boolean(fieldErrors.role)}
                  helperText={fieldErrors.role || ''}
                  margin="normal"
                >
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {formData.role === 'ADMIN' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Permisos del Administrador"
                    helperText="Selecciona los permisos que tendrá este administrador"
                    SelectProps={{
                      multiple: true,
                    }}
                    value={formData.adminPermissions}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleChange(
                        'adminPermissions',
                        typeof value === 'string' ? value.split(',') : value
                      );
                    }}
                  >
                    {adminPermissions.map((perm) => (
                      <MenuItem key={perm.value} value={perm.value}>
                        {perm.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Sufijo"
                  value={formData.suffix}
                  onChange={(e) => handleChange('suffix', e.target.value)}
                  margin="normal"
                >
                  <MenuItem value="">Ninguno</MenuItem>
                  {suffixes.map((suffix) => (
                    <MenuItem key={suffix} value={suffix}>
                      {suffix}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Nombre(s)"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  onBlur={(e) => handleBlur('firstName', e.target.value)}
                  error={Boolean(fieldErrors.firstName)}
                  helperText={fieldErrors.firstName || 'Opcional - puede completarlo después'}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Apellidos"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  onBlur={(e) => handleBlur('lastName', e.target.value)}
                  error={Boolean(fieldErrors.lastName)}
                  helperText={fieldErrors.lastName || 'Opcional - puede completarlo después'}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  placeholder="555-123-4567"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={(e) => handleBlur('phone', e.target.value)}
                  error={Boolean(fieldErrors.phone)}
                  helperText={fieldErrors.phone || ''}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mt: 2, mb: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isActive}
                        onChange={(e) => handleChange('isActive', e.target.checked)}
                      />
                    }
                    label="Usuario Activo"
                  />
                </Box>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                El usuario recibirá sus credenciales y deberá completar su perfil
                al iniciar sesión por primera vez.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={saving}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.email || (!editingUser && !formData.tempPassword) || saving}
          >
            {saving ? 'Guardando...' : editingUser ? 'Actualizar' : 'Crear Usuario'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon />
            Eliminar Usuario
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Esta acción no se puede deshacer
          </Alert>
          {userToDelete && (
            <Box>
              <Typography component="span">
                ¿Estás seguro de que deseas eliminar al usuario{' '}
                <strong>
                  {userToDelete.suffix && `${userToDelete.suffix} `}
                  {userToDelete.firstName} {userToDelete.lastName}
                </strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                ({userToDelete.email})
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => userToDelete && handleDelete(userToDelete.id)}
            disabled={deleting}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Backdrop para operaciones de guardado/eliminación */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={saving || deleting}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            {saving ? 'Guardando usuario...' : 'Eliminando usuario...'}
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
}


