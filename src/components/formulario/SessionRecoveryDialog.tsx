'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFormularioStore } from '@/lib/store';
import { RefreshCw, PlayCircle } from 'lucide-react';

export function SessionRecoveryDialog() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [savedData, setSavedData] = useState<{
    hasData: boolean;
    currentStep: number;
    nombreCompleto?: string;
  } | null>(null);

  const { resetFormulario, currentStep } = useFormularioStore();

  useEffect(() => {
    // Check localStorage for existing data (only on client)
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('mirecurso-formulario-v1');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const state = parsed.state;

        // Check if there's meaningful data saved
        const hasPersonalData = state.datosPersonales?.nombreCompleto;
        const hasPropertyData = state.datosPropiedad?.direccionPropiedad;
        const hasProgress = state.completedSteps?.length > 0;

        if (hasPersonalData || hasPropertyData || hasProgress) {
          setSavedData({
            hasData: true,
            currentStep: state.currentStep || 1,
            nombreCompleto: state.datosPersonales?.nombreCompleto,
          });
          setShowDialog(true);
        }
      } catch {
        // Invalid data, ignore
      }
    }
  }, []);

  const handleContinue = () => {
    setShowDialog(false);
    // Navigate to the saved step
    if (savedData?.currentStep && savedData.currentStep > 1) {
      router.push(`/formulario/paso-${savedData.currentStep}`);
    }
  };

  const handleStartNew = () => {
    resetFormulario();
    setShowDialog(false);
    router.push('/formulario/paso-1');
  };

  if (!savedData?.hasData) {
    return null;
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Tiene un recurso en progreso
          </DialogTitle>
          <DialogDescription className="text-lg pt-2">
            {savedData.nombreCompleto ? (
              <>
                Encontramos datos guardados para <strong>{savedData.nombreCompleto}</strong>.
                ¿Desea continuar donde lo dejó o comenzar un recurso nuevo?
              </>
            ) : (
              <>
                Encontramos datos guardados de una sesión anterior.
                ¿Desea continuar donde lo dejó o comenzar un recurso nuevo?
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={handleContinue}
            className="h-14 text-lg"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            Continuar mi recurso
          </Button>
          <Button
            variant="outline"
            onClick={handleStartNew}
            className="h-14 text-lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Comenzar nuevo recurso
          </Button>
        </div>

        <p className="text-base text-muted-foreground text-center mt-2">
          Sus datos se guardan automáticamente en este dispositivo
        </p>
      </DialogContent>
    </Dialog>
  );
}
