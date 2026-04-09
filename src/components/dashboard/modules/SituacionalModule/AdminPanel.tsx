'use client';

/**
 * AdminPanel — Panel de gestión de requerimientos para SUPERADMIN
 */

import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Stack,
  Divider
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Requisicion {
  _id: string;
  folio: string;
  fecha_creacion: string;
  solicitante: { nombre: string; perfil: string; area: string; userId: string };
  tipo: string;
  modulo_afectado: string;
  respuestas_usuario: Record<string, any>;
  respuestas_admin?: Record<string, any>;
  prioridad_usuario: number;
  prioridad_tecnica?: string;
  estado: string;
  sprint_asignado?: string;
  notas_dev?: string;
  adjuntos?: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ESTADO_COLOR: Record<string, string> = {
  nuevo: '#1976d2',
  en_revision: '#ed6c02',
  en_desarrollo: '#2e7d32',
  completado: '#757575',
  rechazado: '#d32f2f',
  pausado: '#9c27b0'
};

const TIPO_LABEL: Record<string, string> = {
  nueva_funcion: 'Nueva función',
  mejora: 'Mejora',
  error: 'Error',
  comportamiento: 'Comportamiento'
};

const ESTADOS = ['nuevo', 'en_revision', 'en_desarrollo', 'completado', 'rechazado', 'pausado'];
const MODULOS = [
  'Autenticación', 'Pacientes', 'Agenda / Citas',
  'Consulta Médica', 'Laboratorio', 'Facturación / Admisión',
  'Reportes', 'Configuración', 'Otro'
];
const PRIORIDADES_TECNICAS = ['baja', 'media', 'alta', 'epica'];

// ─── Dialog de detalle ────────────────────────────────────────────────────────

interface DetalleDialogProps {
  requisicion: Requisicion | null;
  onClose: () => void;
  onUpdated: () => void;
}

function DetalleDialog({ requisicion, onClose, onUpdated }: DetalleDialogProps) {
  const [tab, setTab] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [snackError, setSnackError] = useState<string | null>(null);

  // Campos técnicos
  const [capasAfectadas, setCapasAfectadas] = useState('');
  const [tecnologiasInvolucradas, setTecnologiasInvolucradas] = useState('');
  const [endpointsAfectados, setEndpointsAfectados] = useState('');
  const [estimacionHoras, setEstimacionHoras] = useState('');
  const [prioridadTecnica, setPrioridadTecnica] = useState('');
  const [sprintAsignado, setSprintAsignado] = useState('');
  const [notas, setNotas] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('');

  useEffect(() => {
    if (requisicion) {
      const admin = requisicion.respuestas_admin ?? {};
      setCapasAfectadas(admin.capas_afectadas ?? '');
      setTecnologiasInvolucradas(admin.tecnologias_involucradas ?? '');
      setEndpointsAfectados(admin.endpoints_afectados ?? '');
      setEstimacionHoras(admin.estimacion_horas ?? '');
      setPrioridadTecnica(requisicion.prioridad_tecnica ?? '');
      setSprintAsignado(requisicion.sprint_asignado ?? '');
      setNotas(requisicion.notas_dev ?? '');
      setNuevoEstado(requisicion.estado);
    }
  }, [requisicion]);

  if (!requisicion) return null;

  const guardarTecnico = async () => {
    setGuardando(true);
    setSnackError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/situacional/requisicion/${requisicion._id}/admin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          respuestas_admin: {
            capas_afectadas: capasAfectadas,
            tecnologias_involucradas: tecnologiasInvolucradas,
            endpoints_afectados: endpointsAfectados,
            estimacion_horas: estimacionHoras
          },
          prioridad_tecnica: prioridadTecnica || undefined,
          sprint_asignado: sprintAsignado,
          notas_dev: notas
        })
      });
      const json = await res.json();
      if (res.ok) {
        onUpdated();
      } else {
        setSnackError(json.error?.message ?? 'Error al guardar');
      }
    } catch {
      setSnackError('Error de conexión');
    } finally {
      setGuardando(false);
    }
  };

  const aplicarEstado = async () => {
    setCambiandoEstado(true);
    setSnackError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/situacional/requisicion/${requisicion._id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      const json = await res.json();
      if (res.ok) {
        onUpdated();
        onClose();
      } else {
        setSnackError(json.error?.message ?? 'Error al cambiar estado');
      }
    } catch {
      setSnackError('Error de conexión');
    } finally {
      setCambiandoEstado(false);
    }
  };

  const estadoChip = (
    <Chip
      label={requisicion.estado.replace('_', ' ')}
      size="small"
      sx={{ backgroundColor: ESTADO_COLOR[requisicion.estado] ?? '#9e9e9e', color: 'white', ml: 1 }}
    />
  );

  return (
    <Dialog open={!!requisicion} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" component="span" fontFamily="monospace">
          {requisicion.folio}
        </Typography>
        {estadoChip}
      </DialogTitle>

      <DialogContent dividers>
        {snackError && <Alert severity="error" sx={{ mb: 2 }}>{snackError}</Alert>}

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="Solicitud" />
          <Tab label="Técnico" />
        </Tabs>

        {/* ─── TAB 0: Solicitud ─── */}
        {tab === 0 && (
          <Stack spacing={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Solicitante</Typography>
                <Typography variant="body2" fontWeight="medium">{requisicion.solicitante.nombre}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Perfil / Área</Typography>
                <Typography variant="body2">{requisicion.solicitante.perfil} — {requisicion.solicitante.area}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Tipo</Typography>
                <Typography variant="body2">{TIPO_LABEL[requisicion.tipo] ?? requisicion.tipo}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Módulo</Typography>
                <Typography variant="body2">{requisicion.modulo_afectado}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Urgencia percibida</Typography>
                <Rating value={requisicion.prioridad_usuario} readOnly max={5} size="small" />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Fecha</Typography>
                <Typography variant="body2">{new Date(requisicion.fecha_creacion).toLocaleDateString('es-MX')}</Typography>
              </Box>
            </Box>

            <Divider />

            {Object.entries(requisicion.respuestas_usuario).map(([key, value]) => {
              if (!value || value === '') return null;
              const label = key
                .replace(/_/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase());
              return (
                <Box key={key}>
                  <Typography variant="caption" color="text.secondary">{label}</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : String(value)}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        )}

        {/* ─── TAB 1: Técnico ─── */}
        {tab === 1 && (
          <Stack spacing={3}>
            <Typography variant="subtitle2" color="primary">SA-A — Análisis de capas</Typography>

            <TextField
              label="Capas afectadas (ej: frontend, API, base de datos, ambas)"
              value={capasAfectadas}
              onChange={e => setCapasAfectadas(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />

            <TextField
              label="Tecnologías involucradas (ej: Prisma, Mongoose, MUI DataGrid)"
              value={tecnologiasInvolucradas}
              onChange={e => setTecnologiasInvolucradas(e.target.value)}
              fullWidth
            />

            <Divider />
            <Typography variant="subtitle2" color="primary">SA-B — Backend</Typography>

            <TextField
              label="Endpoints afectados o a crear (ej: GET /api/pacientes/:id)"
              value={endpointsAfectados}
              onChange={e => setEndpointsAfectados(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />

            <Divider />
            <Typography variant="subtitle2" color="primary">SA-C — Planificación</Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Estimación (horas o días)"
                value={estimacionHoras}
                onChange={e => setEstimacionHoras(e.target.value)}
                fullWidth
              />
              <TextField
                label="Sprint asignado (ej: Sprint-04)"
                value={sprintAsignado}
                onChange={e => setSprintAsignado(e.target.value)}
                fullWidth
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>Prioridad técnica</InputLabel>
              <Select
                value={prioridadTecnica}
                onChange={e => setPrioridadTecnica(e.target.value)}
                label="Prioridad técnica"
              >
                {PRIORIDADES_TECNICAS.map(p => (
                  <MenuItem key={p} value={p} sx={{ textTransform: 'capitalize' }}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Notas de desarrollo"
              value={notas}
              onChange={e => setNotas(e.target.value)}
              multiline
              rows={4}
              fullWidth
              helperText="Notas internas para el equipo de desarrollo"
            />

            <Button
              variant="contained"
              onClick={guardarTecnico}
              disabled={guardando}
              startIcon={guardando ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {guardando ? 'Guardando...' : 'Guardar respuestas técnicas'}
            </Button>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Cambiar estado</InputLabel>
            <Select
              value={nuevoEstado}
              onChange={e => setNuevoEstado(e.target.value)}
              label="Cambiar estado"
            >
              {ESTADOS.map(e => (
                <MenuItem key={e} value={e} sx={{ textTransform: 'capitalize' }}>
                  {e.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            size="small"
            onClick={aplicarEstado}
            disabled={cambiandoEstado || nuevoEstado === requisicion.estado}
          >
            Aplicar
          </Button>
        </Box>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Panel principal ──────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [requisiciones, setRequisiciones] = useState<Requisicion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seleccionada, setSeleccionada] = useState<Requisicion | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroModulo, setFiltroModulo] = useState('');
  const [filtroSprint, setFiltroSprint] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filtroEstado) params.set('estado', filtroEstado);
      if (filtroModulo) params.set('modulo', filtroModulo);
      if (filtroSprint) params.set('sprint', filtroSprint);

      const res = await fetch(`/api/situacional/requisiciones?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok) {
        setRequisiciones(json.data?.requisiciones ?? []);
      } else {
        setError(json.error?.message ?? 'Error al cargar');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setCargando(false);
    }
  }, [filtroEstado, filtroModulo, filtroSprint]);

  useEffect(() => { cargar(); }, [cargar]);

  const columns: GridColDef[] = [
    {
      field: 'folio',
      headerName: 'Folio',
      width: 130,
      renderCell: p => (
        <Typography variant="body2" fontFamily="monospace" fontWeight="bold">
          {p.value}
        </Typography>
      )
    },
    {
      field: 'solicitante',
      headerName: 'Solicitante',
      width: 160,
      valueGetter: (value: any) => value?.nombre ?? ''
    },
    {
      field: 'modulo_afectado',
      headerName: 'Módulo',
      width: 160
    },
    {
      field: 'tipo',
      headerName: 'Tipo',
      width: 140,
      valueGetter: (value: string) => TIPO_LABEL[value] ?? value
    },
    {
      field: 'prioridad_usuario',
      headerName: 'Urgencia',
      width: 130,
      renderCell: p => <Rating value={p.value} readOnly max={5} size="small" />
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 140,
      renderCell: p => (
        <Chip
          label={p.value.replace('_', ' ')}
          size="small"
          sx={{
            backgroundColor: ESTADO_COLOR[p.value] ?? '#9e9e9e',
            color: 'white',
            textTransform: 'capitalize'
          }}
        />
      )
    },
    {
      field: 'fecha_creacion',
      headerName: 'Fecha',
      width: 110,
      valueGetter: (value: string) => new Date(value).toLocaleDateString('es-MX')
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Gestión de Requerimientos
        </Typography>
        <Tooltip title="Actualizar">
          <IconButton onClick={cargar}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <FilterListIcon color="action" />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Estado</InputLabel>
            <Select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} label="Estado">
              <MenuItem value="">Todos</MenuItem>
              {ESTADOS.map(e => (
                <MenuItem key={e} value={e} sx={{ textTransform: 'capitalize' }}>
                  {e.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Módulo</InputLabel>
            <Select value={filtroModulo} onChange={e => setFiltroModulo(e.target.value)} label="Módulo">
              <MenuItem value="">Todos</MenuItem>
              {MODULOS.map(m => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Sprint"
            value={filtroSprint}
            onChange={e => setFiltroSprint(e.target.value)}
            placeholder="ej: Sprint-04"
            sx={{ width: 140 }}
          />
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ height: 520 }}>
        <DataGrid
          rows={requisiciones}
          columns={columns}
          getRowId={row => row._id}
          loading={cargando}
          onRowClick={p => setSeleccionada(p.row as Requisicion)}
          pageSizeOptions={[25, 50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          sx={{ cursor: 'pointer' }}
          localeText={{
            noRowsLabel: 'Sin requerimientos',
            MuiTablePagination: { labelRowsPerPage: 'Filas por página:' }
          }}
        />
      </Paper>

      <DetalleDialog
        requisicion={seleccionada}
        onClose={() => setSeleccionada(null)}
        onUpdated={() => { cargar(); setSeleccionada(null); }}
      />
    </Box>
  );
}
