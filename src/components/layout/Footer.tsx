import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-slate-50 mt-auto">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="text-xl font-semibold text-primary">mirecurso.cl</p>
          <nav className="flex gap-8">
            <Link
              href="/como-funciona"
              className="text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              Cómo funciona
            </Link>
            <Link
              href="/preguntas"
              className="text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              Preguntas frecuentes
            </Link>
          </nav>

          {/* Disclaimer legal */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-xl">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-base text-amber-800 text-left">
              <strong>Aviso legal:</strong> Este servicio genera documentos basados en precedentes judiciales.
              No constituye asesoría legal profesional ni garantiza resultados. Cada caso es evaluado
              individualmente por los tribunales.
            </p>
          </div>

          <p className="text-base text-muted-foreground">
            Desarrollado por Inteligencia Digital
          </p>
        </div>
      </div>
    </footer>
  );
}
