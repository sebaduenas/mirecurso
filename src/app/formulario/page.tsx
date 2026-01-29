'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormularioStore } from '@/lib/store';

export default function FormularioPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Get the current step from the store
    const currentStep = useFormularioStore.getState().currentStep || 1;
    router.replace(`/formulario/paso-${currentStep}`);
  }, [mounted, router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-muted-foreground">Cargando formulario...</p>
    </div>
  );
}
