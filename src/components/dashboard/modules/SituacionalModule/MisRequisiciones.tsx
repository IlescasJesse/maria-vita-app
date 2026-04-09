'use client';

/**
 * MisRequisiciones — Lista de requerimientos del usuario autenticado
 */

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Rating
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Requisicion {
  _id: string;
  folio: string;
  fecha_creacion: string;
  tipo: string;
  modulo_afectado: string;
  estado: string;
  prioridad_usuario: number;
}

// ─── Helpers de estado ────────────────────────────────────────────────────────

const ESTADO_CHIP: Record<string, { label: string; color: 'default' | 'primary' | 'warning' | 'success' | 'error' | 'info' }> = {
  nuevo: { label: 'Nuevo', color: 'primary' },
  en_revision: { label: 'En revisión', color: 'warning' },
  en_desarrollo: { label: 'En desarrollo', color: 'success' },
  completado: { label: 'Completado', color: 'success' },
  rechazado: { label: 'Rechazado', color: 'error' },
  pausado: { label: 'Pausado', color: 'default' }
};

const TIPO_LABEL: Record<string, string> = {
  nueva_funcion: 'Nueva función',
  mejora: 'Mejora',
  error: 'Error',
  comportamiento: 'Comportamiento'
};

// ─── Componente ──────────────────────────────────────────────────────────────

interface Props {
  onNuevoRequerimiento: () => void;
}

export default function MisRequisiciones({ onNuevoRequerimiento }: Props) {
  const [requisiciones, setRequisiciones] = useState<Requisicion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/situacional/mis-requisiciones', {
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
  };

  useEffect(() => { cargar(); }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Mis requerimientos
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Actualizar">
            <IconButton onClick={cargar} size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            onClick={onNuevoRequerimiento}
          >
            Nuevo
          </Button>
        </Box>
      </Box>

      {cargando && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!cargando && !error && requisiciones.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography color="text.secondary" gutterBottom>
            Aún no tienes requerimientos registrados.
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={onNuevoRequerimiento} sx={{ mt: 1 }}>
            Crear mi primer requerimiento
          </Button>
        </Box>
      )}

      {!cargando && requisiciones.length > 0 && (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Folio</strong></TableCell>
                <TableCell><strong>Módulo</strong></TableCell>
                <TableCell><strong>Tipo</strong></TableCell>
                <TableCell><strong>Urgencia</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell><strong>Fecha</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requisiciones.map(r => {
                const chip = ESTADO_CHIP[r.estado] ?? { label: r.estado, color: 'default' as const };
                return (
                  <TableRow key={r._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace" fontWeight="bold">
                        {r.folio}
                      </Typography>
                    </TableCell>
                    <TableCell>{r.modulo_afectado}</TableCell>
                    <TableCell>{TIPO_LABEL[r.tipo] ?? r.tipo}</TableCell>
                    <TableCell>
                      <Rating value={r.prioridad_usuario} readOnly max={5} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={chip.label}
                        color={chip.color}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {new Date(r.fecha_creacion).toLocaleDateString('es-MX')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
