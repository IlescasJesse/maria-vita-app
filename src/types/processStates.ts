/**
 * Estados de procesos compartidos entre frontend y backend
 * Para rastrear el estado de operaciones asíncronas
 */

export type ProcessState = 
  | 'idle'          // Sin procesos activos
  | 'loading'       // Cargando datos
  | 'saving'        // Guardando cambios
  | 'creating'      // Creando nuevo registro
  | 'updating'      // Actualizando registro existente
  | 'deleting'      // Eliminando registro
  | 'validating'    // Validando datos
  | 'processing'    // Procesamiento general
  | 'success'       // Operación exitosa
  | 'error';        // Error en operación

export interface ProcessStatus {
  state: ProcessState;
  message?: string;
  progress?: number;  // 0-100 para operaciones con progreso
  timestamp: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  processState?: ProcessState;
  timestamp: Date;
}

/**
 * Hook personalizado para manejar estados de procesos en frontend
 */
export interface UseProcessStateReturn {
  state: ProcessState;
  isLoading: boolean;
  isProcessing: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  setLoading: () => void;
  setSaving: () => void;
  setCreating: () => void;
  setUpdating: () => void;
  setDeleting: () => void;
  setValidating: () => void;
  setSuccess: (message?: string) => void;
  setError: (message?: string) => void;
  reset: () => void;
}

/**
 * Estados de operaciones CRUD estándar
 */
export const CRUD_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  CREATING: 'creating',
  UPDATING: 'updating',
  DELETING: 'deleting',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

/**
 * Mensajes predeterminados para cada estado
 */
export const DEFAULT_MESSAGES: Record<ProcessState, string> = {
  idle: '',
  loading: 'Cargando datos...',
  saving: 'Guardando cambios...',
  creating: 'Creando registro...',
  updating: 'Actualizando registro...',
  deleting: 'Eliminando registro...',
  validating: 'Validando información...',
  processing: 'Procesando...',
  success: 'Operación completada exitosamente',
  error: 'Ha ocurrido un error',
};

/**
 * Helper para verificar si un estado indica procesamiento activo
 */
export const isProcessingState = (state: ProcessState): boolean => {
  return ['loading', 'saving', 'creating', 'updating', 'deleting', 'validating', 'processing'].includes(state);
};

/**
 * Helper para verificar si un estado indica finalización
 */
export const isFinishedState = (state: ProcessState): boolean => {
  return ['success', 'error', 'idle'].includes(state);
};
