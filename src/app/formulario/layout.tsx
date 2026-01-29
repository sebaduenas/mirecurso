'use client';

import Link from 'next/link';
import { ProgressBar } from '@/components/formulario/ProgressBar';
import { SessionRecoveryDialog } from '@/components/formulario/SessionRecoveryDialog';
import { AutoSaveIndicator } from '@/components/formulario/AutoSaveIndicator';
import { useFormularioStore } from '@/lib/store';

const stepLabels = [
  'Datos personales',
  'Propiedad',
  'Tributario',
  'Revisión',
  'Descarga',
];

export default function FormularioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentStep } = useFormularioStore();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Diálogo de recuperación de sesión */}
      <SessionRecoveryDialog />

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
            totalSteps={5}
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
