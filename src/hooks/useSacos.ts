'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { NovoSacoInput, SacoFlat, EditarSacoInput } from '@/lib/types';

const INTERVALO_POLLING_MS = 3000;

export function useSacos() {
  const [sacos, setSacos] = useState<SacoFlat[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const primeiraCarga = useRef(true);

  const buscar = useCallback(async () => {
    try {
      const res = await fetch('/api/sacos', { cache: 'no-store' });
      if (!res.ok) throw new Error('Falha ao buscar sacos.');
      const data = (await res.json()) as SacoFlat[];
      setSacos(data);
      setErro(null);
    } catch (e) {
      setErro('Não foi possível atualizar os dados agora.');
    } finally {
      if (primeiraCarga.current) {
        setCarregando(false);
        primeiraCarga.current = false;
      }
    }
  }, []);

  useEffect(() => {
    buscar();
    const intervalo = setInterval(buscar, INTERVALO_POLLING_MS);
    return () => clearInterval(intervalo);
  }, [buscar]);

  const criarSaco = useCallback(
    async (input: NovoSacoInput) => {
      const res = await fetch('/api/sacos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.erro ?? 'Erro ao registrar saco.');
      }
      setSacos(data as SacoFlat[]);
    },
    []
  );
  
  const editarSaco = useCallback(async (id: string, input: EditarSacoInput) => {
    const res = await fetch(`/api/sacos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.erro ?? 'Erro ao editar saco.');
    }
    setSacos(data as SacoFlat[]);
  }, []);

  const marcarEncontrado = useCallback(async (id: string) => {
    setSacos((atual) =>
      atual.map((s) => (s.id === id ? { ...s, status: 'encontrado' } : s))
    );
    try {
      const res = await fetch(`/api/sacos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'encontrado' }),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as SacoFlat[];
      setSacos(data);
    } catch {
      setErro('Não foi possível marcar como encontrado. Tentando de novo...');
      buscar();
    }
  }, [buscar]);

  const excluirSaco = useCallback(async (id: string) => {
  setSacos((atual) => atual.filter((s) => s.id !== id));
  try {
    const res = await fetch(`/api/sacos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    const data = (await res.json()) as SacoFlat[];
    setSacos(data);
  } catch {
    setErro('Não foi possível excluir o registro. Tentando de novo...');
    buscar();
  }
}, [buscar]);

  return { sacos, carregando, erro, criarSaco, marcarEncontrado, excluirSaco, recarregar: buscar, editarSaco };
}
