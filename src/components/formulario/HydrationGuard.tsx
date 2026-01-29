'use client';

import { useEffect, useState } from 'react';
import { useFormularioStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface HydrationGuardProps {
  children: React.ReactNode;
}

export function HydrationGuard({ children }: HydrationGuardProps) {
  const [isClient, setIsClient] = useState(false);
  const hasHydrated = useFormularioStore((state) => state._hasHydrated);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !hasHydrated) {
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

  return <>{children}</>;
}
