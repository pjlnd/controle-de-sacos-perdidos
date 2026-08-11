'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSessao } from '@/contexts/SessaoContext';

const abasBase = [
  { href: '/perdidos', label: 'Perdidos' },
  { href: '/encontrados', label: 'Encontrados' },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sessao, carregando, logout } = useSessao();

  const abas = 
    sessao.tipo === 'admin'
      ? [...abasBase, { href: '/admin', label: 'Usuários' }]
      : abasBase;

  async function handleLogout() {
    await logout();
    router.push('/perdidos');
  }

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

        {!carregando && (
          <div className="flex items-center gap-2">
            {sessao.logado ? (
              <>
                <span className="hidden text-sm text-kraft/80 sm:inline">
                  {sessao.nome}{' '}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md border border-kraft/30 px-3 py-1.5 text-sm font-medium text-kraft/90 transition-colors hover:bg-white/10"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                href={`/login?next=${encodeURIComponent(pathname)}`}
                className="rounded-md border border-kraft/30 px-3 py-1.5 text-sm font-medium text-kraft/90 transition-colors hover:bg-white/10"
              >
                Entrar
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
