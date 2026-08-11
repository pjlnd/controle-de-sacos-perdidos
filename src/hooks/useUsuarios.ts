'use client';

import { useCallback, useEffect, useState } from 'react';
import type { NovoUsuarioInput, StatusUsuario, TipoUsuario, UsuarioFlat } from '@/lib/types';

export interface UsuarioComProtecao extends UsuarioFlat {
  protegido: boolean;
}

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioComProtecao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscar = useCallback(async () => {
    try {
      const res = await fetch('/api/usuarios', { cache: 'no-store' });
      if (!res.ok) throw new Error('Falha ao buscar usuários.');
      const data = (await res.json()) as UsuarioComProtecao[];
      setUsuarios(data);
      setErro(null);
    } catch {
      setErro('Não foi possível carregar os usuários.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscar();
  }, [buscar]);

  const criarUsuario = useCallback(async (input: NovoUsuarioInput) => {
    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.erro ?? 'Erro ao criar usuário.');
    setUsuarios(data);
  }, []);

  const editarNome = useCallback(async (id: string, nome: string) => {
    const res = await fetch(`/api/usuarios/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.erro ?? 'Erro ao editar nome.');
    setUsuarios(data);
  }, []);

  const alternarStatus = useCallback(async (id: string, status: StatusUsuario) => {
    const res = await fetch(`/api/usuarios/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.erro ?? 'Erro ao alterar status.');
    setUsuarios(data);
  }, []);

  const mudarTipo = useCallback(async (id: string, tipo: TipoUsuario) => {
    const res = await fetch(`/api/usuarios/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.erro ?? 'Erro ao alterar tipo.');
    setUsuarios(data);
  }, []);

  return {
    usuarios,
    carregando,
    erro,
    criarUsuario,
    editarNome,
    alternarStatus,
    mudarTipo,
    recarregar: buscar,
  };
}