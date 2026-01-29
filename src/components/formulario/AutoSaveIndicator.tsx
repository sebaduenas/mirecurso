'use client';

import { useEffect, useState, useRef } from 'react';
import { useFormularioStore } from '@/lib/store';
import { CheckCircle2, Save, Loader2 } from 'lucide-react';

type SaveState = 'idle' | 'saving' | 'saved';

export function AutoSaveIndicator() {
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get the full state to detect changes
  const { datosPersonales, datosPropiedad, datosTributarios, completedSteps } =
    useFormularioStore();

  // Create a dependency string that changes when data changes
  const dataFingerprint = JSON.stringify({
    datosPersonales,
    datosPropiedad,
    datosTributarios,
    completedSteps,
  });

  useEffect(() => {
    // Skip on initial mount
    if (saveState === 'idle') {
      setSaveState('saved');
      return;
    }

    // Show saving state
    setSaveState('saving');

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // After a short delay, show saved state
    timeoutRef.current = setTimeout(() => {
      setSaveState('saved');

      // Then fade back after a while
      timeoutRef.current = setTimeout(() => {
        setSaveState('idle');
      }, 3000);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [dataFingerprint]);

  return (
    <div
      className={`
        flex items-center justify-center gap-2 py-3 transition-all duration-300
        ${saveState === 'idle' ? 'text-muted-foreground' : ''}
        ${saveState === 'saving' ? 'text-primary' : ''}
        ${saveState === 'saved' ? 'text-green-600' : ''}
      `}
    >
      {saveState === 'idle' && (
        <>
          <Save className="w-5 h-5" />
          <span className="text-base">
            Sus datos se guardan automáticamente
          </span>
        </>
      )}

      {saveState === 'saving' && (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-base font-medium">
            Guardando...
          </span>
        </>
      )}

      {saveState === 'saved' && (
        <>
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-base font-medium">
            Datos guardados
          </span>
        </>
      )}
    </div>
  );
}
