'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProgressBar } from '@/components/formulario/ProgressBar';
import { AutoSaveIndicator } from '@/components/formulario/AutoSaveIndicator';
import { useFormularioStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';

const stepLabels = [
  'Datos personales',
  'Propiedad',
  'Económico',
  'Contribuciones',
  'Procedimiento',
  'Revisión',
  'Descarga',
];

export default function FormularioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const currentStep = useFormularioStore((state) => state.currentStep);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading only during SSR/initial hydration
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
        <header className="sticky top-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-lg">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
            >
              mirecurso.cl
            </Link>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Cargando formulario...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Header con glassmorphism */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              mirecurso.cl
            </Link>
          </div>
        </div>
      </header>

      {/* Barra de progreso moderna */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-border/30">
        <div className="mx-auto max-w-4xl px-4">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={7}
            stepLabels={stepLabels}
          />
        </div>
      </div>

      {/* Contenido del paso */}
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-2xl px-4">
          {children}
        </div>
      </main>

      {/* Footer con indicador de guardado automático */}
      <footer className="border-t border-border/50 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4">
          <AutoSaveIndicator />
        </div>
      </footer>
    </div>
  );
}
