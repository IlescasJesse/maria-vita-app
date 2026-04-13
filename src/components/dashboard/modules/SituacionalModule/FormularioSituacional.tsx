'use client';

/**
 * FormularioSituacional
 * Stepper de 4 pasos para levantar requerimientos del sistema.
 *
 * IMPORTANTE: Todos los pasos se renderizan siempre (display none/block).
 * Esto garantiza que todos los Controller de react-hook-form permanecen
 * montados y registrados, evitando que los valores se pierdan al navegar
 * entre pasos y que handleSubmit los vea como vacíos.
 */

import { useState, useEffect } from 'react';
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
  Chip,
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
  nombre: z.string().optional(),
  perfil: z.string().optional(),
  area: z.string().min(1, 'Selecciona un área'),

  tipo: z.string().refine(
    v => ['nueva_funcion', 'mejora', 'error', 'comportamiento'].includes(v),
    { message: 'Selecciona un tipo de requerimiento' }
  ),
  modulo_afectado: z.string().min(1, 'Selecciona el módulo'),
  frecuencia: z.string().min(1, 'Selecciona la frecuencia'),
  impacto_trabajo: z.string().min(1, 'Selecciona el impacto'),

  descripcion: z.string().min(20, 'Describe el requerimiento con al menos 20 caracteres'),
  resultado_esperado: z.string().min(10, 'Describe el resultado esperado'),
  pasos_para_reproducir: z.string().optional(),
  campo_adicional_1: z.string().optional(),
  campo_adicional_2: z.string().optional(),

  usuarios_afectados: z.string().min(1, 'Indica los usuarios afectados'),
  tiene_proceso_manual: z.boolean(),
  proceso_manual_descripcion: z.string().optional(),
  urgencia: z.number().min(1).max(5),
  desea_contacto: z.boolean()
});

type FormData = z.infer<typeof schema>;

// ─── Catálogos ───────────────────────────────────────────────────────────────

const AREAS = ['Consultorios', 'Laboratorios', 'Administrativo', 'Marketing', 'Otro'];

const MODULOS = [
  'Resumen', 'Usuarios', 'Citas',
  'Estudios', 'Reportes', 'Analíticas',
  'Facturación', 'Base de Datos', 'Configuración',
  'Situacional', 'Otro'
];

const PASOS = ['Identificación', 'Tipo de requerimiento', 'Detalle', 'Impacto'];

// Campos obligatorios por paso (para validar al hacer "Siguiente")
const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
  0: ['area'],
  1: ['tipo', 'modulo_afectado', 'frecuencia', 'impacto_trabajo'],
  2: ['descripcion', 'resultado_esperado'],
  3: ['usuarios_afectados', 'urgencia']
};

// ─── Preguntas dinámicas por módulo ──────────────────────────────────────────

const getPreguntasDinamicas = (modulo: string) => {
  switch (modulo) {
    case 'Citas':
      return {
        label1: '¿En qué parte del flujo de citas ocurre? (ej: agendar, cancelar, recordatorio)',
        label2: '¿Afecta a un tipo de cita o especialista en particular?'
      };
    case 'Estudios':
      return {
        label1: '¿En qué parte del flujo ocurre? (ej: solicitud, captura de resultados, entrega)',
        label2: '¿Cuántos estudios aproximados se ven afectados por turno?'
      };
    case 'Facturación':
      return {
        label1: '¿En qué punto del proceso de facturación ocurre?',
        label2: '¿Hay un tipo de pago o paciente específico donde ocurre más?'
      };
    case 'Usuarios':
      return {
        label1: '¿Afecta a un rol en particular? (ej: paciente, especialista, recepcionista)',
        label2: '¿Ocurre al crear, editar o buscar un usuario?'
      };
    case 'Reportes':
    case 'Analíticas':
      return {
        label1: '¿Qué reporte o gráfica específica presenta el problema?',
        label2: '¿Los datos mostrados son incorrectos, incompletos o no cargan?'
      };
    default:
      return {
        label1: '¿En qué pantalla o sección específica ocurre?',
        label2: '¿Puedes describir el flujo de pasos que realizas cuando lo detectas?'
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
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: '',
      perfil: '',
      area: '',
      tipo: '',
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

  useEffect(() => {
    if (user) {
      setValue('nombre', `${user.firstName} ${user.lastName}`);
      setValue('perfil', user.role);
    }
  }, [user, setValue]);

  const moduloActual = watch('modulo_afectado');
  const tieneProcesoManual = watch('tiene_proceso_manual');
  const preguntasDinamicas = getPreguntasDinamicas(moduloActual);

  // ─── Navegación ──────────────────────────────────────────────────────────

  const handleNext = async () => {
    const valido = await trigger(STEP_FIELDS[activeStep]);
    if (valido) setActiveStep(s => s + 1);
  };

  const handleBack = () => setActiveStep(s => s - 1);

  // ─── Envío ───────────────────────────────────────────────────────────────

  const onSubmit = async (data: FormData) => {
    setEnviando(true);
    try {
      const token = localStorage.getItem('token');
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
          respuestas_usuario: {
            frecuencia: data.frecuencia,
            impacto_trabajo: data.impacto_trabajo,
            descripcion: data.descripcion,
            resultado_esperado: data.resultado_esperado,
            pasos_para_reproducir: data.pasos_para_reproducir,
            pregunta_dinamica_1: data.campo_adicional_1,
            pregunta_dinamica_2: data.campo_adicional_2,
            usuarios_afectados: data.usuarios_afectados,
            proceso_manual: data.tiene_proceso_manual ? data.proceso_manual_descripcion : null,
            desea_contacto: data.desea_contacto
          },
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

  // Si handleSubmit detecta errores en campos de pasos anteriores,
  // navega al primer paso con error para que el usuario los vea.
  const handleFinalSubmit = handleSubmit(onSubmit, (fieldErrors) => {
    for (let step = 0; step <= 3; step++) {
      if ((STEP_FIELDS[step] ?? []).some(f => f in fieldErrors)) {
        setActiveStep(step);
        return;
      }
    }
  });

  // ─── Render ───────────────────────────────────────────────────────────────

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
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {/* Todos los pasos siempre montados — solo se ocultan visualmente */}
      <Box sx={{ minHeight: 300 }}>

        {/* ── Paso 0 · Identificación ─────────────────────────────────── */}
        <Box sx={{ display: activeStep === 0 ? 'block' : 'none' }}>
          <Stack spacing={3}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              A — Identificación del solicitante
            </Typography>
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Nombre completo" fullWidth disabled
                  helperText="Autocompletado desde tu sesión" />
              )}
            />
            <Controller
              name="perfil"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Perfil / Rol" fullWidth disabled
                  helperText="Autocompletado desde tu sesión" />
              )}
            />
            <Controller
              name="area"
              control={control}
              render={({ field }) => (
                <FormControl error={!!errors.area}>
                  <FormLabel sx={{ mb: 1 }}>Área donde laboras *</FormLabel>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {AREAS.map(a => (
                      <Chip
                        key={a}
                        label={a}
                        clickable
                        onClick={() => field.onChange(a)}
                        color={field.value === a ? 'primary' : 'default'}
                        variant={field.value === a ? 'filled' : 'outlined'}
                        sx={{ fontWeight: field.value === a ? 700 : 400 }}
                      />
                    ))}
                  </Box>
                  {errors.area && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.75 }}>
                      {errors.area.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Stack>
        </Box>

        {/* ── Paso 1 · Tipo de requerimiento ──────────────────────────── */}
        <Box sx={{ display: activeStep === 1 ? 'block' : 'none' }}>
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
                <FormControl error={!!errors.modulo_afectado}>
                  <FormLabel sx={{ mb: 1 }}>Módulo o sección del sistema *</FormLabel>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {MODULOS.map(m => (
                      <Chip
                        key={m}
                        label={m}
                        clickable
                        onClick={() => field.onChange(m)}
                        color={field.value === m ? 'primary' : 'default'}
                        variant={field.value === m ? 'filled' : 'outlined'}
                        sx={{ fontWeight: field.value === m ? 700 : 400 }}
                      />
                    ))}
                  </Box>
                  {errors.modulo_afectado && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.75 }}>
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
        </Box>

        {/* ── Paso 2 · Detalle ────────────────────────────────────────── */}
        <Box sx={{ display: activeStep === 2 ? 'block' : 'none' }}>
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
                  multiline rows={4} fullWidth
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
                  multiline rows={3} fullWidth
                  error={!!errors.resultado_esperado}
                  helperText={errors.resultado_esperado?.message}
                />
              )}
            />
            <Box sx={{ display: moduloActual !== 'Estudios' && moduloActual !== 'Facturación' ? 'block' : 'none' }}>
              <Controller
                name="pasos_para_reproducir"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="¿Qué pasos hiciste cuando ocurrió? (opcional)"
                    multiline rows={3} fullWidth
                    helperText="Ej: 1. Entré al módulo de citas. 2. Seleccioné un paciente. 3. Apareció el error."
                  />
                )}
              />
            </Box>
            <Divider />
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              Preguntas específicas para {moduloActual || 'tu módulo'}:
            </Typography>
            <Controller
              name="campo_adicional_1"
              control={control}
              render={({ field }) => (
                <TextField {...field} label={preguntasDinamicas.label1} multiline rows={2} fullWidth />
              )}
            />
            <Controller
              name="campo_adicional_2"
              control={control}
              render={({ field }) => (
                <TextField {...field} label={preguntasDinamicas.label2} multiline rows={2} fullWidth />
              )}
            />
          </Stack>
        </Box>

        {/* ── Paso 3 · Impacto ────────────────────────────────────────── */}
        <Box sx={{ display: activeStep === 3 ? 'block' : 'none' }}>
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
                    control={<Switch checked={field.value} onChange={e => field.onChange(e.target.checked)} />}
                    label="¿Tienes alguna forma manual de resolver esto mientras tanto?"
                  />
                )}
              />
              <Box sx={{ display: tieneProcesoManual ? 'block' : 'none' }}>
                <Controller
                  name="proceso_manual_descripcion"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Describe brevemente cómo lo resuelves actualmente"
                      multiline rows={2} fullWidth sx={{ mt: 1 }}
                    />
                  )}
                />
              </Box>
            </Box>
            <Box>
              <FormLabel component="legend">¿Qué tan urgente consideras que se resuelva esto? *</FormLabel>
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
                  control={<Switch checked={field.value} onChange={e => field.onChange(e.target.checked)} />}
                  label="¿Deseas que te contactemos para dar seguimiento o aclarar dudas?"
                />
              )}
            />
          </Stack>
        </Box>

      </Box>

      {/* ── Navegación ────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
          Atrás
        </Button>
        {activeStep < PASOS.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>
            Siguiente
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleFinalSubmit}
            disabled={enviando}
            startIcon={enviando ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {enviando ? 'Enviando...' : 'Enviar requerimiento'}
          </Button>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.folio ? 'success' : 'error'}
          variant="filled"
          onClose={() => setSnackbar({ open: false })}
        >
          {snackbar.folio
            ? <>¡Requerimiento enviado! Folio: <strong>{snackbar.folio}</strong></>
            : snackbar.error
          }
        </Alert>
      </Snackbar>
    </Paper>
  );
}
