'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto max-w-4xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-primary">
            mirecurso.cl
          </Link>
          <nav className="flex gap-8">
            <Link
              href="/como-funciona"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cómo funciona
            </Link>
            <Link
              href="/preguntas"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Preguntas
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
