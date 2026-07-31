'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const abas = [
  { href: '/perdidos', label: 'Perdidos' },
  { href: '/encontrados', label: 'Encontrados' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b-2 border-ink bg-ink text-kraft">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="font-stencil text-lg uppercase tracking-wide sm:text-xl">
          Registro de Sacos
        </div>
        <nav className="flex gap-1 rounded-md bg-black/20 p-1">
          {abas.map((aba) => {
            const ativo = pathname === aba.href;
            return (
              <Link
                key={aba.href}
                href={aba.href}
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors sm:text-base ${
                  ativo
                    ? 'bg-amber text-ink'
                    : 'text-kraft/80 hover:bg-white/10'
                }`}
              >
                {aba.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
