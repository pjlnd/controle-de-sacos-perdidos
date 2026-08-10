'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface Sessao {
  logado: boolean;
  matricula?: string;
  nome?: string;
  tipo?: 'admin' | 'operario';
}

interface SessaoContextValue {
  sessao: Sessao;
  carregando: boolean;
  login: (matricula: string) => Promise<void>;
  logout: () => Promise<void>;
}

const SessaoContext = createContext<SessaoContextValue | null>(null);

export function SessaoProvider({ children }: { children: React.ReactNode }) {
  const [sessao, setSessao] = useState<Sessao>({ logado: false });
  const [carregando, setCarregando] = useState(true);

  const buscar = useCallback(async () => {
    try {
      const res = await fetch('/api/sessao', { cache: 'no-store' });
      const data = (await res.json()) as Sessao;
      setSessao(data);
    } catch {
      setSessao({ logado: false });
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscar();
  }, [buscar]);

  const login = useCallback(
    async (matricula: string) => {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.erro ?? 'Erro ao entrar.');
      }
      await buscar();
    },
    [buscar]
  );

  const logout = useCallback(async () => {
    await fetch('/api/logout', { method: 'POST' });
    setSessao({ logado: false });
  }, []);

  return (
    <SessaoContext.Provider value={{ sessao, carregando, login, logout }}>
      {children}
    </SessaoContext.Provider>
  );
}

export function useSessao() {
  const contexto = useContext(SessaoContext);
  if (!contexto) {
    throw new Error('useSessao precisa ser usado dentro de um <SessaoProvider>.');
  }
  return contexto;
}