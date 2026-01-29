'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormularioStore } from '@/lib/store';

export default function FormularioPage() {
  const router = useRouter();
  const currentStep = useFormularioStore((state) => state.currentStep);
  const setCurrentStep = useFormularioStore((state) => state.setCurrentStep);
  const hasHydrated = useFormularioStore((state) => state._hasHydrated);

  useEffect(() => {
    // Wait for hydration before redirecting
    if (!hasHydrated) return;

    // Redirigir al paso actual guardado o al paso 1
    const step = currentStep || 1;
    setCurrentStep(step);
    router.replace(`/formulario/paso-${step}`);
  }, [currentStep, router, setCurrentStep, hasHydrated]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-muted-foreground">Cargando formulario...</p>
    </div>
  );
}
