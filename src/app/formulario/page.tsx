'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormularioStore } from '@/lib/store';

export default function FormularioPage() {
  const router = useRouter();
  const { currentStep, setCurrentStep } = useFormularioStore();

  useEffect(() => {
    // Redirigir al paso actual guardado o al paso 1
    const step = currentStep || 1;
    setCurrentStep(step);
    router.replace(`/formulario/paso-${step}`);
  }, [currentStep, router, setCurrentStep]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-muted-foreground">Cargando formulario...</p>
    </div>
  );
}
