import { useCallback, useState } from 'react';

interface OptimisticOptions<TResult, TContext> {
    applyOptimistic: () => TContext;
    mutation: () => Promise<TResult>;
    rollback?: (context: TContext) => void;
    onSuccess?: (result: TResult, context: TContext) => void | Promise<void>;
    onError?: (error: unknown, context: TContext) => void | Promise<void>;
}

/**
 * Hook reusable para operaciones optimistas.
 * Permite aplicar un cambio inmediato en UI, ejecutar la mutación real
 * y revertir automáticamente en caso de error.
 */
export function useOptimisticMutation() {
    const [isRunning, setIsRunning] = useState(false);

    const runOptimistic = useCallback(
        async <TResult, TContext>(options: OptimisticOptions<TResult, TContext>) => {
            setIsRunning(true);
            const context = options.applyOptimistic();

            try {
                const result = await options.mutation();
                if (options.onSuccess) {
                    await options.onSuccess(result, context);
                }
                return { ok: true as const, result };
            } catch (error) {
                if (options.rollback) {
                    options.rollback(context);
                }
                if (options.onError) {
                    await options.onError(error, context);
                }
                return { ok: false as const, error };
            } finally {
                setIsRunning(false);
            }
        },
        []
    );

    return {
        isRunning,
        runOptimistic,
    };
}
