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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Diálogo de recuperación de sesión */}
      <SessionRecoveryDialog />

      {/* Header simplificado */}
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-primary">
              mirecurso.cl
            </Link>
          </div>
        </div>
      </header>

      {/* Barra de progreso */}
      <div className="bg-white border-b border-border">
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
      <footer className="border-t border-border bg-white">
        <div className="mx-auto max-w-4xl px-4">
          <AutoSaveIndicator />
        </div>
      </footer>
    </div>
  );
}
