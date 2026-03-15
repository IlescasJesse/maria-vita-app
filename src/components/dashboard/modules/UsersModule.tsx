/**
 * Módulo Unificado de Usuarios
 * Consolida Especialistas, Pacientes y Administradores en una sola vista con tabs.
 */

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Avatar,
    Backdrop,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Skeleton,
    Stack,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    CheckCircleOutline as CheckCircleOutlineIcon,
    Delete as DeleteIcon,
    LockPerson as LockPersonIcon,
    Edit as EditIcon,
    PersonAdd as PersonAddIcon,
    Search as SearchIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useOptimisticMutation } from '@/hooks/useOptimisticMutation';
import { useAuth } from '@/hooks/useAuth';

type UserRole = 'SUPERADMIN' | 'ADMIN' | 'SPECIALIST' | 'PATIENT' | 'RECEPTIONIST';
type UserCategory = 'specialists' | 'patients' | 'admins';

interface SpecialistSummary {
    id: string;
    fullName: string;
    specialty: string;
    licenseNumber: string;
    assignedOffice?: string | null;
    biography?: string | null;
    yearsOfExperience?: number | null;
    photoUrl?: string | null;
    consultationFee?: number | string | null;
    isAvailable: boolean;
    updatedAt: string;
}

interface UserRecord {
    id: string;
    email: string;
    role: UserRole;
    suffix?: string | null;
    firstName: string;
    lastName: string;
    phone?: string | null;
    dateOfBirth?: string | null;
    isActive: boolean;
    isNew: boolean;
    isAdmin?: boolean;
    adminPermissions?: string[] | null;
    createdAt: string;
    updatedAt?: string;
    specialist?: SpecialistSummary | null;
}

interface FormState {
    email: string;
    role: Exclude<UserRole, 'SUPERADMIN'>;
    suffix: string;
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: string;
    isActive: boolean;
    tempPassword: string;
    adminPermissions: string[];
}

const roles: Array<{ value: Exclude<UserRole, 'SUPERADMIN'>; label: string }> = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'SPECIALIST', label: 'Especialista' },
    { value: 'RECEPTIONIST', label: 'Recepcionista' },
    { value: 'PATIENT', label: 'Paciente' },
];

const suffixes = ['Dr.', 'Dra.', 'Lic.', 'Ing.', 'Mtro.', 'Mtra.', 'C.P.', 'Enf.'];

const adminPermissionOptions = [
    { label: 'Gestionar usuarios', value: 'manage_users' },
    { label: 'Gestionar especialistas', value: 'manage_specialists' },
    { label: 'Gestionar citas', value: 'manage_appointments' },
    { label: 'Ver reportes', value: 'view_reports' },
    { label: 'Gestionar configuración', value: 'manage_settings' },
];

const defaultFormState: FormState = {
    email: '',
    role: 'PATIENT',
    suffix: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    isActive: true,
    tempPassword: '',
    adminPermissions: [],
};

const renderEmailWithStyle = (email: string) => {
    const parts = email.split('@');

    if (parts.length !== 2) {
        return <span>{email}</span>;
    }

    return (
        <Box component="span">
            <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {parts[0]}
            </Box>
            <Box component="span" sx={{ fontWeight: 300, color: 'text.secondary', fontSize: '0.9em' }}>
                @{parts[1]}
            </Box>
        </Box>
    );
};

const getRoleColor = (role: UserRole) => {
    switch (role) {
        case 'SUPERADMIN':
            return 'error' as const;
        case 'ADMIN':
            return 'warning' as const;
        case 'SPECIALIST':
            return 'info' as const;
        case 'PATIENT':
            return 'secondary' as const;
        case 'RECEPTIONIST':
            return 'primary' as const;
        default:
            return 'default' as const;
    }
};

const getRoleLabel = (role: UserRole) => {
    switch (role) {
        case 'SUPERADMIN':
            return 'Superadmin';
        case 'ADMIN':
            return 'Administrador';
        case 'SPECIALIST':
            return 'Especialista';
        case 'PATIENT':
            return 'Paciente';
        case 'RECEPTIONIST':
            return 'Recepcionista';
        default:
            return role;
    }
};

const formatDate = (value?: string | null) => {
    if (!value) return 'No registrado';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'No registrado';

    return new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
};

const formatCurrency = (value?: number | string | null) => {
    if (value === null || value === undefined || value === '') {
        return 'No definido';
    }

    const numericValue = typeof value === 'string' ? Number(value) : value;
    if (Number.isNaN(numericValue)) {
        return 'No definido';
    }

    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 0,
    }).format(numericValue);
};

const getUserFullName = (user: UserRecord) => {
    const prefix = user.suffix ? `${user.suffix} ` : '';
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    return `${prefix}${fullName}`.trim() || user.email;
};

const getDefaultRoleByTab = (tab: UserCategory): Exclude<UserRole, 'SUPERADMIN'> => {
    if (tab === 'specialists') return 'SPECIALIST';
    if (tab === 'admins') return 'ADMIN';
    return 'PATIENT';
};

const getCreateLabelByTab = (tab: UserCategory) => {
    if (tab === 'specialists') return 'Nuevo especialista';
    if (tab === 'admins') return 'Nuevo administrador';
    return 'Nuevo paciente';
};

const getEditDialogTitle = (user: UserRecord | null) => {
    if (!user) return 'Crear nuevo usuario';
    if (user.role === 'ADMIN') return 'Gestionar administrador';
    if (user.role === 'SPECIALIST') return 'Gestionar acceso del especialista';
    if (user.role === 'PATIENT') return 'Gestionar acceso del paciente';
    return 'Gestionar usuario';
};

export default function UsersModule() {
    const { user, hasPermission, isSuperAdmin } = useAuth();
    const { runOptimistic } = useOptimisticMutation();

    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<UserCategory>('specialists');
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
    const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<FormState>(defaultFormState);

    const canManageUsers = hasPermission('manage_users');
    const canManageSpecialists = hasPermission('manage_specialists');
    const canManageAdmins = hasPermission('manage_admins') || isSuperAdmin;

    const canCreateInActiveTab = useMemo(() => {
        if (activeTab === 'specialists') return canManageSpecialists;
        if (activeTab === 'admins') return canManageAdmins;
        return canManageUsers;
    }, [activeTab, canManageAdmins, canManageSpecialists, canManageUsers]);

    const createButtonLabel = useMemo(() => getCreateLabelByTab(activeTab), [activeTab]);

    const availableTabs = useMemo(() => {
        const tabs: Array<{ value: UserCategory; label: string; count: number }> = [];

        if (canManageSpecialists) {
            tabs.push({
                value: 'specialists',
                label: 'Especialistas',
                count: users.filter((currentUser) => currentUser.role === 'SPECIALIST').length,
            });
        }

        if (canManageUsers) {
            tabs.push({
                value: 'patients',
                label: 'Pacientes',
                count: users.filter((currentUser) => currentUser.role === 'PATIENT').length,
            });
        }

        if (canManageAdmins) {
            tabs.push({
                value: 'admins',
                label: 'Administradores',
                count: users.filter((currentUser) => ['ADMIN', 'SUPERADMIN'].includes(currentUser.role)).length,
            });
        }

        return tabs;
    }, [canManageAdmins, canManageSpecialists, canManageUsers, users]);

    useEffect(() => {
        if (!availableTabs.some((tab) => tab.value === activeTab) && availableTabs[0]) {
            setActiveTab(availableTabs[0].value);
        }
    }, [activeTab, availableTabs]);

    const validateField = useCallback((field: keyof FormState, value: string) => {
        switch (field) {
            case 'email': {
                if (editingUser) return '';
                const emailValue = value.trim();

                if (!emailValue) return 'El email es requerido';
                if (emailValue.includes('@ADMIN') || emailValue.includes('@admin')) return '';

                const finalEmail = emailValue.includes('@') ? emailValue : `${emailValue}@maria-vita.mx`;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(finalEmail) ? '' : 'Email no válido';
            }
            case 'role':
                return value ? '' : 'El rol es requerido';
            case 'tempPassword':
                if (editingUser) return '';
                if (!value) return 'La contraseña temporal es requerida';
                return value.length >= 6 ? '' : 'La contraseña debe tener al menos 6 caracteres';
            case 'firstName': {
                const trimmed = value.trim();
                if (!trimmed) return 'El nombre es requerido';
                return trimmed.length >= 2 ? '' : 'El nombre debe tener al menos 2 caracteres';
            }
            case 'lastName':
                return value.trim().length <= 100 ? '' : 'Los apellidos no pueden superar 100 caracteres';
            case 'phone':
                return value && !/^\d+$/.test(value) ? 'El teléfono debe ser numérico' : '';
            default:
                return '';
        }
    }, [editingUser]);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json().catch(() => ({ message: 'Error al cargar usuarios' }));

            if (!response.ok) {
                throw new Error(data?.error?.message || data?.message || 'Error al cargar usuarios');
            }

            setUsers(Array.isArray(data) ? data : data.data || []);
            setError('');
        } catch (requestError: unknown) {
            setError(requestError instanceof Error ? requestError.message : 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const filteredUsers = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        const categoryUsers = users.filter((currentUser) => {
            if (activeTab === 'specialists') return currentUser.role === 'SPECIALIST';
            if (activeTab === 'patients') return currentUser.role === 'PATIENT';
            return currentUser.role === 'ADMIN' || currentUser.role === 'SUPERADMIN';
        });

        if (!normalizedSearch) {
            return categoryUsers;
        }

        return categoryUsers.filter((currentUser) => {
            const searchSource = [
                currentUser.email,
                currentUser.firstName,
                currentUser.lastName,
                currentUser.phone,
                currentUser.specialist?.specialty,
                currentUser.specialist?.licenseNumber,
                currentUser.specialist?.assignedOffice,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return searchSource.includes(normalizedSearch);
        });
    }, [activeTab, searchTerm, users]);

    const canManageTargetUser = useCallback((targetUser: UserRecord) => {
        if (targetUser.role === 'SPECIALIST') return canManageSpecialists;
        if (targetUser.role === 'ADMIN' || targetUser.role === 'SUPERADMIN') return canManageAdmins;
        return canManageUsers;
    }, [canManageAdmins, canManageSpecialists, canManageUsers]);

    const openCreateDialog = useCallback((role?: Exclude<UserRole, 'SUPERADMIN'>) => {
        setEditingUser(null);
        setFieldErrors({});
        setFormData({
            ...defaultFormState,
            role: role || defaultFormState.role,
        });
        setOpenDialog(true);
    }, []);

    const openEditDialog = useCallback((targetUser: UserRecord) => {
        setEditingUser(targetUser);
        setFieldErrors({});
        setFormData({
            email: targetUser.email,
            role: targetUser.role === 'SUPERADMIN' ? 'ADMIN' : targetUser.role,
            suffix: targetUser.suffix || '',
            firstName: targetUser.firstName,
            lastName: targetUser.lastName || '',
            phone: targetUser.phone || '',
            dateOfBirth: targetUser.dateOfBirth ? targetUser.dateOfBirth.slice(0, 10) : '',
            isActive: targetUser.isActive,
            tempPassword: '',
            adminPermissions: Array.isArray(targetUser.adminPermissions) ? targetUser.adminPermissions : [],
        });
        setOpenDialog(true);
    }, []);

    const closeDialog = useCallback(() => {
        if (saving) return;

        setOpenDialog(false);
        setEditingUser(null);
        setFieldErrors({});
        setFormData(defaultFormState);
    }, [saving]);

    const handleChange = useCallback((field: keyof FormState, value: string | boolean | string[]) => {
        setFieldErrors((previous) => ({ ...previous, [field]: '' }));
        setFormData((previous) => ({ ...previous, [field]: value }));
    }, []);

    const handleBlur = useCallback((field: keyof FormState, value: string) => {
        setFieldErrors((previous) => ({ ...previous, [field]: validateField(field, value) }));
    }, [validateField]);

    const handleSubmit = useCallback(async () => {
        try {
            setSaving(true);
            setError('');
            setFieldErrors({});

            const nextFieldErrors: Record<string, string> = {};
            const finalEmailInput = formData.email.trim();
            const finalEmail = finalEmailInput && !finalEmailInput.includes('@')
                ? `${finalEmailInput}@maria-vita.mx`
                : finalEmailInput;

            const fieldsToValidate: Array<keyof FormState> = ['email', 'role', 'firstName', 'lastName', 'phone'];
            if (!editingUser) {
                fieldsToValidate.push('tempPassword');
            }

            fieldsToValidate.forEach((field) => {
                const rawValue = field === 'email' ? finalEmail : String(formData[field] ?? '');
                const validationMessage = validateField(field, rawValue);
                if (validationMessage) {
                    nextFieldErrors[field] = validationMessage;
                }
            });

            if (Object.keys(nextFieldErrors).length > 0) {
                setFieldErrors(nextFieldErrors);
                return;
            }

            const payload = {
                email: finalEmail,
                role: formData.role,
                suffix: formData.suffix || null,
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                phone: formData.phone.trim() || null,
                dateOfBirth: formData.dateOfBirth || null,
                isActive: formData.isActive,
                tempPassword: formData.tempPassword || undefined,
                adminPermissions: formData.role === 'ADMIN' ? formData.adminPermissions : [],
            };

            const token = localStorage.getItem('token');
            const endpoint = editingUser ? `/api/users/${editingUser.id}` : '/api/users/create';
            const method = editingUser ? 'PUT' : 'POST';

            if (!editingUser) {
                const optimisticId = `temp-${Date.now()}`;
                const optimisticUser: UserRecord = {
                    id: optimisticId,
                    email: finalEmail,
                    role: formData.role,
                    suffix: formData.suffix || null,
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    phone: formData.phone.trim() || null,
                    dateOfBirth: formData.dateOfBirth || null,
                    isActive: formData.isActive,
                    isNew: true,
                    isAdmin: formData.role === 'ADMIN',
                    adminPermissions: formData.role === 'ADMIN' ? formData.adminPermissions : [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    specialist: formData.role === 'SPECIALIST'
                        ? {
                            id: `temp-specialist-${Date.now()}`,
                            fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
                            specialty: 'Por definir',
                            licenseNumber: 'Pendiente',
                            assignedOffice: null,
                            biography: null,
                            yearsOfExperience: null,
                            photoUrl: null,
                            consultationFee: null,
                            isAvailable: true,
                            updatedAt: new Date().toISOString(),
                        }
                        : null,
                };

                closeDialog();

                const result = await runOptimistic({
                    applyOptimistic: () => {
                        setUsers((previous) => [optimisticUser, ...previous]);
                        return { optimisticId };
                    },
                    rollback: (context: { optimisticId: string }) => {
                        setUsers((previous) => previous.filter((currentUser) => currentUser.id !== context.optimisticId));
                    },
                    mutation: async () => {
                        const response = await fetch(endpoint, {
                            method,
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(payload),
                        });

                        const responseData = await response.json().catch(() => ({}));

                        if (!response.ok) {
                            throw new Error(responseData?.error?.message || responseData?.message || 'No fue posible crear el usuario');
                        }

                        return responseData;
                    },
                    onSuccess: (responseData, context: { optimisticId: string }) => {
                        if (responseData?.data?.id) {
                            setUsers((previous) => previous.map((currentUser) => (
                                currentUser.id === context.optimisticId ? responseData.data : currentUser
                            )));
                        }

                        loadUsers();
                    },
                    onError: (submitError) => {
                        setError(submitError instanceof Error ? submitError.message : 'No fue posible crear el usuario');
                        setOpenDialog(true);
                    },
                });

                if (!result.ok) {
                    return;
                }

                setSuccess('Usuario creado exitosamente');
            } else {
                const editPayload = editingUser.role === 'ADMIN'
                    ? {
                        isActive: formData.isActive,
                        adminPermissions: formData.adminPermissions,
                    }
                    : {
                        isActive: formData.isActive,
                    };

                const previousUser = editingUser;
                const optimisticUser: UserRecord = {
                    ...editingUser,
                    isActive: formData.isActive,
                    adminPermissions: editingUser.role === 'ADMIN' ? formData.adminPermissions : editingUser.adminPermissions,
                };

                closeDialog();

                const result = await runOptimistic({
                    applyOptimistic: () => {
                        setUsers((previous) => previous.map((currentUser) => (
                            currentUser.id === previousUser.id ? optimisticUser : currentUser
                        )));
                        return { previousUser };
                    },
                    rollback: (context: { previousUser: UserRecord }) => {
                        setUsers((previous) => previous.map((currentUser) => (
                            currentUser.id === context.previousUser.id ? context.previousUser : currentUser
                        )));
                    },
                    mutation: async () => {
                        const response = await fetch(endpoint, {
                            method,
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(editPayload),
                        });

                        const responseData = await response.json().catch(() => ({}));

                        if (!response.ok) {
                            throw new Error(responseData?.error?.message || responseData?.message || 'No fue posible actualizar el usuario');
                        }

                        return responseData;
                    },
                    onSuccess: (responseData, context: { previousUser: UserRecord }) => {
                        if (responseData?.data?.id) {
                            setUsers((previous) => previous.map((currentUser) => (
                                currentUser.id === context.previousUser.id ? responseData.data : currentUser
                            )));
                        }

                        loadUsers();
                    },
                    onError: (submitError, context: { previousUser: UserRecord }) => {
                        setError(submitError instanceof Error ? submitError.message : 'No fue posible actualizar el usuario');
                        openEditDialog(context.previousUser);
                    },
                });

                if (!result.ok) {
                    return;
                }

                setSuccess('Usuario actualizado exitosamente');
            }

            setTimeout(() => setSuccess(''), 4000);
        } finally {
            setSaving(false);
        }
    }, [closeDialog, editingUser, formData, loadUsers, openEditDialog, runOptimistic, validateField]);

    const handleToggleUserStatus = useCallback(async (targetUser: UserRecord) => {
        try {
            setSaving(true);
            setError('');

            const token = localStorage.getItem('token');
            const optimisticUser: UserRecord = {
                ...targetUser,
                isActive: !targetUser.isActive,
            };

            const result = await runOptimistic({
                applyOptimistic: () => {
                    setUsers((previous) => previous.map((currentUser) => (
                        currentUser.id === targetUser.id ? optimisticUser : currentUser
                    )));
                    return { previousUser: targetUser };
                },
                rollback: (context: { previousUser: UserRecord }) => {
                    setUsers((previous) => previous.map((currentUser) => (
                        currentUser.id === context.previousUser.id ? context.previousUser : currentUser
                    )));
                },
                mutation: async () => {
                    const response = await fetch(`/api/users/${targetUser.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ isActive: !targetUser.isActive }),
                    });

                    const responseData = await response.json().catch(() => ({}));

                    if (!response.ok) {
                        throw new Error(responseData?.error?.message || responseData?.message || 'No fue posible actualizar el acceso del usuario');
                    }

                    return responseData;
                },
                onSuccess: () => {
                    loadUsers();
                },
                onError: (submitError) => {
                    setError(submitError instanceof Error ? submitError.message : 'No fue posible actualizar el acceso del usuario');
                },
            });

            if (!result.ok) return;

            setSuccess(targetUser.isActive ? 'Usuario inhabilitado exitosamente' : 'Usuario reactivado exitosamente');
            setTimeout(() => setSuccess(''), 4000);
        } finally {
            setSaving(false);
        }
    }, [loadUsers, runOptimistic]);

    const handleOpenDeleteDialog = useCallback((targetUser: UserRecord) => {
        setUserToDelete(targetUser);
        setOpenDeleteDialog(true);
    }, []);

    const handleDelete = useCallback(async () => {
        if (!userToDelete) return;

        try {
            setSaving(true);
            setError('');

            const token = localStorage.getItem('token');
            const deletedUser = userToDelete;

            setOpenDeleteDialog(false);

            const result = await runOptimistic({
                applyOptimistic: () => {
                    setUsers((previous) => previous.filter((currentUser) => currentUser.id !== deletedUser.id));
                    return { deletedUser };
                },
                rollback: (context: { deletedUser: UserRecord }) => {
                    setUsers((previous) => [context.deletedUser, ...previous]);
                },
                mutation: async () => {
                    const response = await fetch(`/api/users/${deletedUser.id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const responseData = await response.json().catch(() => ({}));

                    if (!response.ok) {
                        throw new Error(responseData?.error?.message || responseData?.message || 'No fue posible eliminar el usuario');
                    }

                    return responseData;
                },
                onError: (deleteError) => {
                    setError(deleteError instanceof Error ? deleteError.message : 'No fue posible eliminar el usuario');
                },
            });

            if (!result.ok) {
                return;
            }

            setUserToDelete(null);
            setSuccess('Usuario eliminado exitosamente');
            setTimeout(() => setSuccess(''), 4000);
        } finally {
            setSaving(false);
        }
    }, [runOptimistic, userToDelete]);

    const openView = useCallback((targetUser: UserRecord) => {
        setSelectedUser(targetUser);
        setOpenViewDialog(true);
    }, []);

    const emptyStateLabel = useMemo(() => {
        if (activeTab === 'specialists') return 'No hay especialistas registrados con este criterio.';
        if (activeTab === 'patients') return 'No hay pacientes registrados con este criterio.';
        return 'No hay administradores registrados con este criterio.';
    }, [activeTab]);

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
                    {success}
                </Alert>
            )}

            <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'center' }}
                spacing={2}
                mb={3}
            >
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Usuarios
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Gestión administrativa de accesos. Los especialistas editan su propio perfil desde su cuenta.
                    </Typography>
                </Box>
            </Stack>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                {availableTabs.map((tab) => (
                    <Grid item xs={12} md={4} key={tab.value}>
                        <Card
                            variant="outlined"
                            sx={{
                                borderColor: activeTab === tab.value ? 'primary.main' : 'divider',
                                backgroundColor: activeTab === tab.value ? 'primary.50' : 'background.paper',
                            }}
                        >
                            <CardContent>
                                <Typography variant="overline" color="text.secondary">
                                    Vista actual
                                </Typography>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" fontWeight={700}>
                                        {tab.label}
                                    </Typography>
                                    <Chip label={tab.count} color={activeTab === tab.value ? 'primary' : 'default'} size="small" />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Paper sx={{ mb: 3, overflow: 'hidden' }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, value: UserCategory) => setActiveTab(value)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                >
                    {availableTabs.map((tab) => (
                        <Tab
                            key={tab.value}
                            value={tab.value}
                            label={`${tab.label} (${tab.count})`}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        />
                    ))}
                </Tabs>

                <Box sx={{ p: 3 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }}>
                        <TextField
                            fullWidth
                            placeholder="Buscar por nombre, email, teléfono, especialidad o cédula"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {canCreateInActiveTab && (
                            <Button
                                variant="outlined"
                                startIcon={<PersonAddIcon />}
                                onClick={() => openCreateDialog(getDefaultRoleByTab(activeTab))}
                                sx={{ minWidth: { md: 220 } }}
                            >
                                {createButtonLabel}
                            </Button>
                        )}
                    </Stack>
                </Box>
            </Paper>

            <Grid container spacing={3}>
                {loading &&
                    Array.from({ length: 6 }).map((_, index) => (
                        <Grid item xs={12} md={6} xl={4} key={`skeleton-${index}`}>
                            <Card>
                                <CardContent>
                                    <Stack direction="row" spacing={2} mb={2}>
                                        <Skeleton variant="circular" width={56} height={56} />
                                        <Box sx={{ flex: 1 }}>
                                            <Skeleton variant="text" width="60%" height={32} />
                                            <Skeleton variant="text" width="80%" />
                                        </Box>
                                    </Stack>
                                    <Skeleton variant="rounded" height={20} sx={{ mb: 1 }} />
                                    <Skeleton variant="rounded" height={20} sx={{ mb: 1 }} />
                                    <Skeleton variant="rounded" height={20} sx={{ mb: 1 }} />
                                    <Skeleton variant="rounded" height={20} width="50%" />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}

                {!loading && filteredUsers.length === 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                Sin resultados
                            </Typography>
                            <Typography color="text.secondary">{emptyStateLabel}</Typography>
                        </Paper>
                    </Grid>
                )}

                {!loading && filteredUsers.map((currentUser) => {
                    const fullName = getUserFullName(currentUser);
                    const canDelete = isSuperAdmin && user?.id !== currentUser.id;
                    const canManageCurrentUser = canManageTargetUser(currentUser) && currentUser.role !== 'SUPERADMIN';

                    return (
                        <Grid item xs={12} md={6} xl={4} key={currentUser.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Stack direction="row" spacing={2} alignItems="flex-start" mb={2.5}>
                                        <Avatar
                                            src={currentUser.specialist?.photoUrl || undefined}
                                            sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontWeight: 700 }}
                                        >
                                            {fullName.charAt(0).toUpperCase()}
                                        </Avatar>

                                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                            <Typography variant="h6" fontWeight={700} noWrap>
                                                {fullName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                                                {renderEmailWithStyle(currentUser.email)}
                                            </Typography>
                                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.25 }}>
                                                <Chip label={getRoleLabel(currentUser.role)} color={getRoleColor(currentUser.role)} size="small" />
                                                <Chip
                                                    label={currentUser.isActive ? 'Activo' : 'Inactivo'}
                                                    color={currentUser.isActive ? 'success' : 'default'}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                                {currentUser.isNew && (
                                                    <Chip label="Perfil pendiente" color="warning" size="small" variant="outlined" />
                                                )}
                                                {currentUser.specialist && (
                                                    <Chip
                                                        label={currentUser.specialist.isAvailable ? 'Disponible' : 'No disponible'}
                                                        color={currentUser.specialist.isAvailable ? 'success' : 'default'}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Stack>
                                        </Box>
                                    </Stack>

                                    <Stack spacing={1.2}>
                                        {activeTab === 'specialists' && currentUser.specialist && (
                                            <>
                                                <Typography variant="body2"><strong>Especialidad:</strong> {currentUser.specialist.specialty}</Typography>
                                                <Typography variant="body2"><strong>Cédula:</strong> {currentUser.specialist.licenseNumber}</Typography>
                                                <Typography variant="body2"><strong>Consultorio:</strong> {currentUser.specialist.assignedOffice || 'Por asignar'}</Typography>
                                                <Typography variant="body2"><strong>Experiencia:</strong> {currentUser.specialist.yearsOfExperience ? `${currentUser.specialist.yearsOfExperience} años` : 'No registrada'}</Typography>
                                                <Typography variant="body2"><strong>Consulta:</strong> {formatCurrency(currentUser.specialist.consultationFee)}</Typography>
                                            </>
                                        )}

                                        {activeTab === 'patients' && (
                                            <>
                                                <Typography variant="body2"><strong>Teléfono:</strong> {currentUser.phone || 'No registrado'}</Typography>
                                                <Typography variant="body2"><strong>Fecha de nacimiento:</strong> {formatDate(currentUser.dateOfBirth)}</Typography>
                                                <Typography variant="body2"><strong>Registro:</strong> {formatDate(currentUser.createdAt)}</Typography>
                                            </>
                                        )}

                                        {activeTab === 'admins' && (
                                            <>
                                                <Typography variant="body2"><strong>Teléfono:</strong> {currentUser.phone || 'No registrado'}</Typography>
                                                <Typography variant="body2"><strong>Nivel:</strong> {currentUser.role === 'SUPERADMIN' ? 'Acceso total' : 'Administración operativa'}</Typography>
                                                <Typography variant="body2">
                                                    <strong>Permisos:</strong> {currentUser.role === 'SUPERADMIN'
                                                        ? 'Todos los permisos del sistema'
                                                        : Array.isArray(currentUser.adminPermissions) && currentUser.adminPermissions.length > 0
                                                            ? `${currentUser.adminPermissions.length} permisos configurados`
                                                            : 'Sin permisos específicos asignados'}
                                                </Typography>
                                                <Typography variant="body2"><strong>Alta:</strong> {formatDate(currentUser.createdAt)}</Typography>
                                            </>
                                        )}

                                        {activeTab !== 'patients' && currentUser.phone && (
                                            <Typography variant="body2"><strong>Teléfono:</strong> {currentUser.phone}</Typography>
                                        )}
                                    </Stack>

                                    {activeTab === 'admins' && Array.isArray(currentUser.adminPermissions) && currentUser.adminPermissions.length > 0 && currentUser.role !== 'SUPERADMIN' && (
                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                                            {currentUser.adminPermissions.slice(0, 3).map((permission) => (
                                                <Chip key={permission} label={permission} size="small" variant="outlined" />
                                            ))}
                                            {currentUser.adminPermissions.length > 3 && (
                                                <Chip label={`+${currentUser.adminPermissions.length - 3}`} size="small" />
                                            )}
                                        </Stack>
                                    )}
                                </CardContent>

                                <Divider />

                                <CardActions sx={{ px: 2, py: 1.5, justifyContent: 'space-between' }}>
                                    <Button size="small" startIcon={<VisibilityIcon />} onClick={() => openView(currentUser)}>
                                        Ver detalle
                                    </Button>

                                    <Stack direction="row" spacing={0.5}>
                                        {canManageCurrentUser && (
                                            <Tooltip title={currentUser.role === 'ADMIN' ? 'Editar permisos' : 'Gestionar acceso'}>
                                                <IconButton color="primary" onClick={() => openEditDialog(currentUser)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {canManageCurrentUser && (
                                            <Tooltip title={currentUser.isActive ? 'Inhabilitar usuario' : 'Reactivar usuario'}>
                                                <IconButton
                                                    color={currentUser.isActive ? 'warning' : 'success'}
                                                    onClick={() => handleToggleUserStatus(currentUser)}
                                                >
                                                    {currentUser.isActive ? <LockPersonIcon /> : <CheckCircleOutlineIcon />}
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {canDelete && (
                                            <Tooltip title="Eliminar usuario">
                                                <IconButton color="error" onClick={() => handleOpenDeleteDialog(currentUser)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Stack>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Dialog open={openDialog} onClose={closeDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{getEditDialogTitle(editingUser)}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {!editingUser ? (
                            <>
                                <TextField
                                    label="Email"
                                    value={formData.email}
                                    onChange={(event) => handleChange('email', event.target.value)}
                                    onBlur={(event) => handleBlur('email', event.target.value)}
                                    error={Boolean(fieldErrors.email)}
                                    helperText={fieldErrors.email || 'Si no agregas dominio, se usará @maria-vita.mx'}
                                    fullWidth
                                />

                                <TextField
                                    select
                                    label="Rol"
                                    value={formData.role}
                                    onChange={(event) => handleChange('role', event.target.value as FormState['role'])}
                                    error={Boolean(fieldErrors.role)}
                                    helperText={fieldErrors.role}
                                    fullWidth
                                >
                                    {roles.map((roleOption) => (
                                        <MenuItem key={roleOption.value} value={roleOption.value}>
                                            {roleOption.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <TextField
                                        select
                                        label="Prefijo"
                                        value={formData.suffix}
                                        onChange={(event) => handleChange('suffix', event.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem value="">Sin prefijo</MenuItem>
                                        {suffixes.map((suffix) => (
                                            <MenuItem key={suffix} value={suffix}>
                                                {suffix}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        label="Teléfono"
                                        value={formData.phone}
                                        onChange={(event) => handleChange('phone', event.target.value)}
                                        onBlur={(event) => handleBlur('phone', event.target.value)}
                                        error={Boolean(fieldErrors.phone)}
                                        helperText={fieldErrors.phone}
                                        fullWidth
                                    />
                                </Stack>

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <TextField
                                        label="Nombre"
                                        value={formData.firstName}
                                        onChange={(event) => handleChange('firstName', event.target.value)}
                                        onBlur={(event) => handleBlur('firstName', event.target.value)}
                                        error={Boolean(fieldErrors.firstName)}
                                        helperText={fieldErrors.firstName}
                                        fullWidth
                                    />

                                    <TextField
                                        label="Apellidos"
                                        value={formData.lastName}
                                        onChange={(event) => handleChange('lastName', event.target.value)}
                                        onBlur={(event) => handleBlur('lastName', event.target.value)}
                                        error={Boolean(fieldErrors.lastName)}
                                        helperText={fieldErrors.lastName}
                                        fullWidth
                                    />
                                </Stack>

                                <TextField
                                    label="Fecha de nacimiento"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(event) => handleChange('dateOfBirth', event.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />

                                <TextField
                                    label="Contraseña temporal"
                                    type="password"
                                    value={formData.tempPassword}
                                    onChange={(event) => handleChange('tempPassword', event.target.value)}
                                    onBlur={(event) => handleBlur('tempPassword', event.target.value)}
                                    error={Boolean(fieldErrors.tempPassword)}
                                    helperText={fieldErrors.tempPassword}
                                    fullWidth
                                />
                            </>
                        ) : (
                            <Alert severity="info">
                                {editingUser.role === 'ADMIN'
                                    ? 'Desde esta vista administrativa solo se gestionan permisos y estado de acceso del administrador.'
                                    : 'El perfil profesional o personal se edita desde la cuenta del propio usuario. Aquí solo gestionas su acceso al sistema.'}
                            </Alert>
                        )}

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.isActive}
                                    onChange={(event) => handleChange('isActive', event.target.checked)}
                                />
                            }
                            label="Usuario activo"
                        />

                        {((!editingUser && formData.role === 'ADMIN') || editingUser?.role === 'ADMIN') && canManageAdmins && (
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Permisos administrativos
                                </Typography>

                                <FormGroup>
                                    {adminPermissionOptions.map((permission) => {
                                        const isChecked = formData.adminPermissions.includes(permission.value);

                                        return (
                                            <FormControlLabel
                                                key={permission.value}
                                                control={
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onChange={(event) => {
                                                            if (event.target.checked) {
                                                                handleChange('adminPermissions', [...formData.adminPermissions, permission.value]);
                                                                return;
                                                            }

                                                            handleChange(
                                                                'adminPermissions',
                                                                formData.adminPermissions.filter((item) => item !== permission.value)
                                                            );
                                                        }}
                                                    />
                                                }
                                                label={permission.label}
                                            />
                                        );
                                    })}
                                </FormGroup>
                            </Box>
                        )}

                        {!editingUser && formData.role === 'SPECIALIST' && (
                            <Alert severity="info">
                                Los datos clínicos del especialista se muestran desde la base actual y podrán ampliarse en el siguiente paso.
                            </Alert>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} disabled={saving}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={saving}>
                        {saving ? 'Guardando...' : editingUser ? 'Guardar cambios' : 'Crear usuario'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Detalle del usuario</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar
                                    src={selectedUser.specialist?.photoUrl || undefined}
                                    sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.5rem', fontWeight: 700 }}
                                >
                                    {getUserFullName(selectedUser).charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={700}>
                                        {getUserFullName(selectedUser)}
                                    </Typography>
                                    <Typography color="text.secondary">{selectedUser.email}</Typography>
                                </Box>
                            </Stack>

                            <Divider />

                            <Typography variant="body2"><strong>Rol:</strong> {getRoleLabel(selectedUser.role)}</Typography>
                            <Typography variant="body2"><strong>Estado:</strong> {selectedUser.isActive ? 'Activo' : 'Inactivo'}</Typography>
                            <Typography variant="body2"><strong>Teléfono:</strong> {selectedUser.phone || 'No registrado'}</Typography>
                            <Typography variant="body2"><strong>Fecha de nacimiento:</strong> {formatDate(selectedUser.dateOfBirth)}</Typography>
                            <Typography variant="body2"><strong>Alta:</strong> {formatDate(selectedUser.createdAt)}</Typography>

                            {selectedUser.specialist && (
                                <>
                                    <Divider />
                                    <Typography variant="subtitle1" fontWeight={700}>Ficha del especialista</Typography>
                                    <Typography variant="body2"><strong>Especialidad:</strong> {selectedUser.specialist.specialty}</Typography>
                                    <Typography variant="body2"><strong>Cédula:</strong> {selectedUser.specialist.licenseNumber}</Typography>
                                    <Typography variant="body2"><strong>Consultorio:</strong> {selectedUser.specialist.assignedOffice || 'Por asignar'}</Typography>
                                    <Typography variant="body2"><strong>Experiencia:</strong> {selectedUser.specialist.yearsOfExperience ? `${selectedUser.specialist.yearsOfExperience} años` : 'No registrada'}</Typography>
                                    <Typography variant="body2"><strong>Costo de consulta:</strong> {formatCurrency(selectedUser.specialist.consultationFee)}</Typography>
                                    <Typography variant="body2"><strong>Biografía:</strong> {selectedUser.specialist.biography || 'Sin biografía registrada'}</Typography>
                                </>
                            )}

                            {(selectedUser.role === 'ADMIN' || selectedUser.role === 'SUPERADMIN') && (
                                <>
                                    <Divider />
                                    <Typography variant="subtitle1" fontWeight={700}>Permisos administrativos</Typography>
                                    {selectedUser.role === 'SUPERADMIN' ? (
                                        <Alert severity="warning">Cuenta con acceso total al sistema.</Alert>
                                    ) : Array.isArray(selectedUser.adminPermissions) && selectedUser.adminPermissions.length > 0 ? (
                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                            {selectedUser.adminPermissions.map((permission) => (
                                                <Chip key={permission} label={permission} size="small" variant="outlined" />
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Sin permisos específicos configurados.
                                        </Typography>
                                    )}
                                </>
                            )}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenViewDialog(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={() => !saving && setOpenDeleteDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ color: 'error.main' }}>Eliminar usuario</DialogTitle>
                <DialogContent>
                    <Typography>
                        {userToDelete
                            ? `¿Seguro que deseas eliminar a ${getUserFullName(userToDelete)}? Esta acción también eliminará su perfil relacionado si aplica.`
                            : '¿Seguro que deseas eliminar este usuario?'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} disabled={saving}>Cancelar</Button>
                    <Button color="error" variant="contained" onClick={handleDelete} disabled={saving}>
                        {saving ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={saving}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
}
