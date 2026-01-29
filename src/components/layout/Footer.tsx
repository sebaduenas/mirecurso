import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-gradient-to-b from-slate-50 to-slate-100 mt-auto">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Logo and nav */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
            >
              mirecurso.cl
            </Link>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <nav className="flex gap-6">
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
          </div>

          {/* Disclaimer legal */}
          <div className="flex items-start gap-3 bg-amber-50/80 border border-amber-200/50 rounded-xl p-4 max-w-2xl">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-base text-amber-700 text-left leading-relaxed">
              <strong>Aviso legal:</strong> Este servicio genera documentos basados en precedentes judiciales.
              No constituye asesoría legal profesional ni garantiza resultados.
            </p>
          </div>

          {/* Credits */}
          <div className="text-center">
            <p className="text-base text-muted-foreground">
              Desarrollado con{' '}
              <span className="text-red-500">♥</span>
              {' '}por{' '}
              <span className="font-medium text-foreground">Inteligencia Digital</span>
            </p>
            <p className="text-base text-muted-foreground mt-1">
              © {new Date().getFullYear()} mirecurso.cl
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
