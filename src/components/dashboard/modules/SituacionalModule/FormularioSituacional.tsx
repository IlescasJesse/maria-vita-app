'use client';

/**
 * FormularioSituacional
 * Stepper de 4 pasos para levantar requerimientos del sistema
 */

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Switch,
  Rating,
  Snackbar,
  Alert,
  Paper,
  Divider,
  CircularProgress,
  Stack
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

// ─── Schema de validación ────────────────────────────────────────────────────

const schema = z.object({
  // Paso 1
  nombre: z.string().min(2, 'Nombre requerido'),
  perfil: z.string().min(1),
  area: z.string().min(1, 'Selecciona un área'),

  // Paso 2
  tipo: z.enum(['nueva_funcion', 'mejora', 'error', 'comportamiento'], {
    required_error: 'Selecciona un tipo de requerimiento'
  }),
  modulo_afectado: z.string().min(1, 'Selecciona el módulo'),
  frecuencia: z.string().min(1, 'Selecciona la frecuencia'),
  impacto_trabajo: z.string().min(1, 'Selecciona el impacto'),

  // Paso 3
  descripcion: z.string().min(20, 'Describe el requerimiento con al menos 20 caracteres'),
  resultado_esperado: z.string().min(10, 'Describe el resultado esperado'),
  pasos_para_reproducir: z.string().optional(),
  campo_adicional_1: z.string().optional(),
  campo_adicional_2: z.string().optional(),

  // Paso 4
  usuarios_afectados: z.string().min(1, 'Indica los usuarios afectados'),
  tiene_proceso_manual: z.boolean(),
  proceso_manual_descripcion: z.string().optional(),
  urgencia: z.number({ required_error: 'Califica la urgencia' }).min(1).max(5),
  desea_contacto: z.boolean()
});

type FormData = z.infer<typeof schema>;

// ─── Catálogos ───────────────────────────────────────────────────────────────

const AREAS = [
  'Consultorios', 'Laboratorios', 'Administrativo', 'Marketing', 'Otro'
];

const MODULOS = [
  'Autenticación', 'Pacientes', 'Agenda / Citas',
  'Consulta Médica', 'Laboratorio', 'Facturación / Admisión',
  'Reportes', 'Configuración', 'Otro'
];

const PASOS = ['Identificación', 'Tipo de requerimiento', 'Detalle', 'Impacto'];

const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
  0: ['area'],
  1: ['tipo', 'modulo_afectado', 'frecuencia', 'impacto_trabajo'],
  2: ['descripcion', 'resultado_esperado'],
  3: ['usuarios_afectados', 'urgencia']
};

// ─── Preguntas dinámicas según módulo ────────────────────────────────────────

const getPreguntasDinamicas = (modulo: string) => {
  switch (modulo) {
    case 'Consulta Médica':
      return {
        label1: '¿En qué parte de la consulta ocurre la situación? (ej: notas, diagnóstico, indicaciones)',
        label2: '¿Afecta la atención al paciente durante la consulta?',
        label3: '¿Con qué frecuencia atiendes consultas donde esto ocurre?'
      };
    case 'Laboratorio':
      return {
        label1: '¿En qué parte del flujo de laboratorio ocurre? (ej: solicitud, captura de resultados, entrega)',
        label2: '¿Cuántos estudios aproximados se ven afectados por turno?',
        label3: '¿Hay alguna muestra o tipo de estudio específico involucrado?'
      };
    case 'Facturación / Admisión':
      return {
        label1: '¿En qué punto del proceso de admisión o facturación ocurre?',
        label2: '¿Hay un paciente o tipo de pago específico donde ocurre más?',
        label3: '¿Cuántos registros se ven afectados aproximadamente por día?'
      };
    default:
      return {
        label1: '¿En qué pantalla o sección específica ocurre?',
        label2: '¿Puedes describir el flujo de pasos que realizas cuando lo detectas?',
        label3: '¿Existe alguna condición particular que lo desencadene?'
      };
  }
};

// ─── Componente principal ────────────────────────────────────────────────────

interface Props {
  onSuccess: () => void;
}

export default function FormularioSituacional({ onSuccess }: Props) {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; folio?: string; error?: string }>({ open: false });

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: user ? `${user.firstName} ${user.lastName}` : '',
      perfil: user?.role ?? '',
      area: '',
      tipo: undefined,
      modulo_afectado: '',
      frecuencia: '',
      impacto_trabajo: '',
      descripcion: '',
      resultado_esperado: '',
      pasos_para_reproducir: '',
      campo_adicional_1: '',
      campo_adicional_2: '',
      usuarios_afectados: '',
      tiene_proceso_manual: false,
      proceso_manual_descripcion: '',
      urgencia: 3,
      desea_contacto: false
    }
  });

  const moduloActual = watch('modulo_afectado');
  const tieneProcesoManual = watch('tiene_proceso_manual');
  const preguntasDinamicas = getPreguntasDinamicas(moduloActual);

  const handleNext = async () => {
    const camposDelPaso = STEP_FIELDS[activeStep] ?? [];
    const valido = await trigger(camposDelPaso);
    if (valido) setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const onSubmit = async (data: FormData) => {
    setEnviando(true);
    try {
      const token = localStorage.getItem('token');
      const respuestas_usuario = {
        frecuencia: data.frecuencia,
        impacto_trabajo: data.impacto_trabajo,
        descripcion: data.descripcion,
        resultado_esperado: data.resultado_esperado,
        pasos_para_reproducir: data.pasos_para_reproducir,
        pregunta_dinamica_1: data.campo_adicional_1,
        pregunta_dinamica_2: data.campo_adicional_2,
        usuarios_afectados: data.usuarios_afectados,
        proceso_manual: data.tiene_proceso_manual
          ? data.proceso_manual_descripcion
          : null,
        desea_contacto: data.desea_contacto
      };

      const res = await fetch('/api/situacional/requisicion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          area: data.area,
          tipo: data.tipo,
          modulo_afectado: data.modulo_afectado,
          respuestas_usuario,
          prioridad_usuario: data.urgencia
        })
      });

      const json = await res.json();
      if (res.ok) {
        setSnackbar({ open: true, folio: json.data?.requisicion?.folio });
        setTimeout(onSuccess, 2500);
      } else {
        setSnackbar({ open: true, error: json.error?.message ?? 'Error al enviar' });
      }
    } catch {
      setSnackbar({ open: true, error: 'Error de conexión' });
    } finally {
      setEnviando(false);
    }
  };

  // ─── Pasos ───────────────────────────────────────────────────────────────

  const renderPaso0 = () => (
    <Stack spacing={3}>
      <Typography variant="subtitle1" fontWeight="bold" color="primary">
        A — Identificación del solicitante
      </Typography>
      <Controller
        name="nombre"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Nombre completo"
            fullWidth
            disabled
            helperText="Autocompletado desde tu sesión"
          />
        )}
      />
      <Controller
        name="perfil"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Perfil / Rol"
            fullWidth
            disabled
            helperText="Autocompletado desde tu sesión"
          />
        )}
      />
      <Controller
        name="area"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.area}>
            <InputLabel>Área donde laboras *</InputLabel>
            <Select {...field} label="Área donde laboras *">
              {AREAS.map(a => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </Select>
            {errors.area && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.area.message}
              </Typography>
            )}
          </FormControl>
        )}
      />
    </Stack>
  );

  const renderPaso1 = () => (
    <Stack spacing={3}>
      <Typography variant="subtitle1" fontWeight="bold" color="primary">
        B — Tipo de requerimiento
      </Typography>
      <Controller
        name="tipo"
        control={control}
        render={({ field }) => (
          <FormControl error={!!errors.tipo}>
            <FormLabel>¿Qué tipo de requerimiento deseas registrar? *</FormLabel>
            <RadioGroup {...field}>
              <FormControlLabel value="nueva_funcion" control={<Radio />} label="Nueva función — algo que no existe y quisiera que existiera" />
              <FormControlLabel value="mejora" control={<Radio />} label="Mejora — algo que ya existe pero podría funcionar mejor" />
              <FormControlLabel value="error" control={<Radio />} label="Error — algo que no funciona como debería" />
              <FormControlLabel value="comportamiento" control={<Radio />} label="Comportamiento inesperado — algo raro que no sé cómo clasificar" />
            </RadioGroup>
            {errors.tipo && <Typography variant="caption" color="error">{errors.tipo.message}</Typography>}
          </FormControl>
        )}
      />

      <Controller
        name="modulo_afectado"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.modulo_afectado}>
            <InputLabel>Módulo o sección del sistema *</InputLabel>
            <Select {...field} label="Módulo o sección del sistema *">
              {MODULOS.map(m => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
            {errors.modulo_afectado && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.modulo_afectado.message}
              </Typography>
            )}
          </FormControl>
        )}
      />

      <Controller
        name="frecuencia"
        control={control}
        render={({ field }) => (
          <FormControl error={!!errors.frecuencia}>
            <FormLabel>¿Con qué frecuencia te encuentras con esta situación? *</FormLabel>
            <RadioGroup {...field}>
              <FormControlLabel value="siempre" control={<Radio />} label="Siempre — cada vez que uso el sistema" />
              <FormControlLabel value="frecuente" control={<Radio />} label="Frecuente — varias veces a la semana" />
              <FormControlLabel value="ocasional" control={<Radio />} label="Ocasional — una o dos veces al mes" />
              <FormControlLabel value="rara_vez" control={<Radio />} label="Rara vez — muy pocas veces" />
            </RadioGroup>
            {errors.frecuencia && <Typography variant="caption" color="error">{errors.frecuencia.message}</Typography>}
          </FormControl>
        )}
      />

      <Controller
        name="impacto_trabajo"
        control={control}
        render={({ field }) => (
          <FormControl error={!!errors.impacto_trabajo}>
            <FormLabel>¿Cómo afecta esta situación tu trabajo diario? *</FormLabel>
            <RadioGroup {...field}>
              <FormControlLabel value="bloquea" control={<Radio />} label="Me bloquea completamente — no puedo continuar sin resolverlo" />
              <FormControlLabel value="retrasa" control={<Radio />} label="Me retrasa — tardo más de lo necesario" />
              <FormControlLabel value="incomoda" control={<Radio />} label="Es incómodo — pero puedo continuar de otra manera" />
              <FormControlLabel value="estetico" control={<Radio />} label="Solo estético — no afecta el flujo de trabajo" />
            </RadioGroup>
            {errors.impacto_trabajo && <Typography variant="caption" color="error">{errors.impacto_trabajo.message}</Typography>}
          </FormControl>
        )}
      />
    </Stack>
  );

  const renderPaso2 = () => (
    <Stack spacing={3}>
      <Typography variant="subtitle1" fontWeight="bold" color="primary">
        C — Detalle del requerimiento
        {moduloActual && (
          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({moduloActual})
          </Typography>
        )}
      </Typography>

      <Controller
        name="descripcion"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Describe la situación con tus propias palabras *"
            multiline
            rows={4}
            fullWidth
            error={!!errors.descripcion}
            helperText={errors.descripcion?.message ?? 'Sin tecnicismos — describe qué pasa y cuándo'}
          />
        )}
      />

      <Controller
        name="resultado_esperado"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="¿Cómo debería funcionar idealmente? *"
            multiline
            rows={3}
            fullWidth
            error={!!errors.resultado_esperado}
            helperText={errors.resultado_esperado?.message}
          />
        )}
      />

      {moduloActual === 'Consulta Médica' || moduloActual === 'Laboratorio' || moduloActual === 'Facturación / Admisión' ? null : (
        <Controller
          name="pasos_para_reproducir"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="¿Qué pasos hiciste cuando ocurrió? (opcional)"
              multiline
              rows={3}
              fullWidth
              helperText="Ej: 1. Entré al módulo de citas. 2. Seleccioné un paciente. 3. Apareció el error."
            />
          )}
        />
      )}

      {/* Preguntas dinámicas según módulo */}
      <Divider />
      <Typography variant="body2" color="text.secondary" fontStyle="italic">
        Preguntas específicas para {moduloActual || 'tu módulo'}:
      </Typography>

      <Controller
        name="campo_adicional_1"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={preguntasDinamicas.label1}
            multiline
            rows={2}
            fullWidth
          />
        )}
      />

      <Controller
        name="campo_adicional_2"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={preguntasDinamicas.label2}
            multiline
            rows={2}
            fullWidth
          />
        )}
      />
    </Stack>
  );

  const renderPaso3 = () => (
    <Stack spacing={3}>
      <Typography variant="subtitle1" fontWeight="bold" color="primary">
        D — Impacto y cierre
      </Typography>

      <Controller
        name="usuarios_afectados"
        control={control}
        render={({ field }) => (
          <FormControl error={!!errors.usuarios_afectados}>
            <FormLabel>¿Quiénes más se ven afectados por esta situación? *</FormLabel>
            <RadioGroup {...field}>
              <FormControlLabel value="solo_yo" control={<Radio />} label="Solo yo" />
              <FormControlLabel value="mi_area" control={<Radio />} label="Todo mi equipo o área" />
              <FormControlLabel value="varios_areas" control={<Radio />} label="Varias áreas de la clínica" />
              <FormControlLabel value="pacientes" control={<Radio />} label="También afecta a los pacientes" />
            </RadioGroup>
            {errors.usuarios_afectados && <Typography variant="caption" color="error">{errors.usuarios_afectados.message}</Typography>}
          </FormControl>
        )}
      />

      <Box>
        <Controller
          name="tiene_proceso_manual"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch {...field} checked={field.value} />}
              label="¿Tienes alguna forma manual de resolver esto mientras tanto?"
            />
          )}
        />
        {tieneProcesoManual && (
          <Controller
            name="proceso_manual_descripcion"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Describe brevemente cómo lo resuelves actualmente"
                multiline
                rows={2}
                fullWidth
                sx={{ mt: 1 }}
              />
            )}
          />
        )}
      </Box>

      <Box>
        <FormLabel component="legend">
          ¿Qué tan urgente consideras que se resuelva esto? *
        </FormLabel>
        <Controller
          name="urgencia"
          control={control}
          render={({ field }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Rating
                value={field.value}
                onChange={(_, val) => field.onChange(val ?? 1)}
                max={5}
                size="large"
              />
              <Typography variant="body2" color="text.secondary">
                {field.value === 1 && 'Puede esperar'}
                {field.value === 2 && 'Baja prioridad'}
                {field.value === 3 && 'Moderada'}
                {field.value === 4 && 'Alta prioridad'}
                {field.value === 5 && 'Urgente'}
              </Typography>
            </Box>
          )}
        />
        {errors.urgencia && <Typography variant="caption" color="error">{errors.urgencia.message}</Typography>}
      </Box>

      <Controller
        name="desea_contacto"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch {...field} checked={field.value} />}
            label="¿Deseas que te contactemos para dar seguimiento o aclarar dudas?"
          />
        )}
      />
    </Stack>
  );

  const pasoActual = [renderPaso0, renderPaso1, renderPaso2, renderPaso3][activeStep];
  const esUltimoPaso = activeStep === PASOS.length - 1;

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Nuevo Requerimiento
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Cuéntanos qué necesitas o qué encontraste. Sin tecnicismos — solo describe tu experiencia.
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {PASOS.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ minHeight: 300 }}>
        {pasoActual?.()}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Atrás
        </Button>

        {esUltimoPaso ? (
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={enviando}
            startIcon={enviando ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {enviando ? 'Enviando...' : 'Enviar requerimiento'}
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext}>
            Siguiente
          </Button>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {snackbar.folio ? (
          <Alert severity="success" variant="filled">
            ¡Requerimiento enviado! Folio: <strong>{snackbar.folio}</strong>
          </Alert>
        ) : (
          <Alert severity="error" variant="filled">
            {snackbar.error}
          </Alert>
        )}
      </Snackbar>
    </Paper>
  );
}
