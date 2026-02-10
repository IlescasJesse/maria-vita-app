import { useState, useCallback } from 'react';
import { 
  ProcessState, 
  UseProcessStateReturn, 
  DEFAULT_MESSAGES,
  isProcessingState 
} from '@/types/processStates';

/**
 * Hook personalizado para manejar estados de procesos
 * Uso: const process = useProcessState();
 * 
 * Ejemplo:
 * ```tsx
 * const process = useProcessState();
 * 
 * const handleSave = async () => {
 *   process.setSaving();
 *   try {
 *     await api.save(data);
 *     process.setSuccess('Datos guardados correctamente');
 *   } catch (error) {
 *     process.setError('Error al guardar');
 *   }
 * };
 * 
 * return (
 *   <div>
 *     <Button disabled={process.isProcessing} onClick={handleSave}>
 *       {process.isProcessing ? process.message : 'Guardar'}
 *     </Button>
 *     <Backdrop open={process.isProcessing}>
 *       <CircularProgress />
 *       <Typography>{process.message}</Typography>
 *     </Backdrop>
 *   </div>
 * );
 * ```
 */
export const useProcessState = (): UseProcessStateReturn => {
  const [state, setState] = useState<ProcessState>('idle');
  const [message, setMessage] = useState<string>('');

  const setStateWithMessage = useCallback((newState: ProcessState, customMessage?: string) => {
    setState(newState);
    setMessage(customMessage || DEFAULT_MESSAGES[newState]);
  }, []);

  return {
    state,
    isLoading: state === 'loading',
    isProcessing: isProcessingState(state),
    isSuccess: state === 'success',
    isError: state === 'error',
    message,

    setLoading: () => setStateWithMessage('loading'),
    setSaving: () => setStateWithMessage('saving'),
    setCreating: () => setStateWithMessage('creating'),
    setUpdating: () => setStateWithMessage('updating'),
    setDeleting: () => setStateWithMessage('deleting'),
    setValidating: () => setStateWithMessage('validating'),
    setSuccess: (msg?: string) => setStateWithMessage('success', msg),
    setError: (msg?: string) => setStateWithMessage('error', msg),
    reset: () => {
      setState('idle');
      setMessage('');
    },
  };
};

/**
 * Hook simplificado para operaciones CRUD
 */
export const useCrudState = () => {
  const process = useProcessState();

  return {
    ...process,
    // Alias específicos para CRUD
    startCreate: () => process.setCreating(),
    startUpdate: () => process.setUpdating(),
    startDelete: () => process.setDeleting(),
    startLoad: () => process.setLoading(),
  };
};
