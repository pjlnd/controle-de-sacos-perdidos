'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSessao } from '@/contexts/SessaoContext';

function FormularioLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useSessao();
  const [matricula, setMatricula] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!/^\d{1,9}$/.test(matricula)) {
      setErro('Informe uma matrícula válida (só números).');
      return;
    }

    setEnviando(true);
    try {
      await login(matricula);
      const destino = searchParams.get('next') ?? '/perdidos';
      router.push(destino);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao entrar.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="tag-card flex flex-col gap-4 p-6 pl-8">
      <span className="tag-hole" aria-hidden="true" />

      <div>
        <label className="text-xs font-medium uppercase tracking-wide text-inkfaded">
          Número de matrícula
        </label>
        <input
          className="w-full rounded-md border border-ink/25 bg-white px-3 py-2 font-mono text-ink focus:border-ink"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value.replace(/\D/g, '').slice(0, 9))}
          inputMode="numeric"
          placeholder="000000000"
          autoFocus
          required
        />
      </div>

      {erro && (
        <div className="rounded-md bg-alert/10 px-3 py-2 text-sm text-alert">{erro}</div>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-kraft hover:bg-ink/90 disabled:opacity-60"
      >
        {enviando ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 pt-12">
      <h1 className="text-center font-stencil text-2xl uppercase tracking-wide">Entrar</h1>
      <Suspense fallback={null}>
        <FormularioLogin />
      </Suspense>
    </div>
  );
}