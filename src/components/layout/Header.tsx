'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const handleScrollLink = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            mirecurso.cl
          </Link>
          <nav className="flex items-center gap-2">
            <a
              href={isHomePage ? '#como-funciona' : '/#como-funciona'}
              onClick={(e) => handleScrollLink(e, 'como-funciona')}
              className="text-base font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-full hover:bg-muted transition-colors"
            >
              Cómo funciona
            </a>
            <a
              href={isHomePage ? '#preguntas' : '/#preguntas'}
              onClick={(e) => handleScrollLink(e, 'preguntas')}
              className="text-base font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-full hover:bg-muted transition-colors"
            >
              Preguntas
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
