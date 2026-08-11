'use client';

import { useState } from 'react';
import type { StatusUsuario, TipoUsuario, UsuarioFlat } from '@/lib/types';
import type { UsuarioComProtecao } from '@/hooks/useUsuarios';

interface UsuarioLinhaProps {
  usuario: UsuarioComProtecao;
  souEu: boolean;
  onEditarNome: (id: string, nome: string) => Promise<void>;
  onAlternarStatus: (id: string, status: StatusUsuario) => Promise<void>;
  onMudarTipo: (id: string, tipo: TipoUsuario) => Promise<void>;
}

export default function UsuarioLinha({
  usuario,
  souEu,
  onEditarNome,
  onAlternarStatus,
  onMudarTipo,
}: UsuarioLinhaProps) {
  const [editando, setEditando] = useState(false);
  const [nomeEditado, setNomeEditado] = useState(usuario.nome);
  const [erro, setErro] = useState<string | null>(null);
  const [processando, setProcessando] = useState(false);

  async function salvarNome() {
    if (!nomeEditado.trim()) return;
    setErro(null);
    setProcessando(true);
    try {
      await onEditarNome(usuario.id, nomeEditado.trim());
      setEditando(false);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar nome.');
    } finally {
      setProcessando(false);
    }
  }

  async function alternarStatus() {
    setErro(null);
    setProcessando(true);
    try {
      await onAlternarStatus(usuario.id, usuario.status === 'ativo' ? 'inativo' : 'ativo');
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao alterar status.');
    } finally {
      setProcessando(false);
    }
  }

  async function mudarTipo(novoTipo: TipoUsuario) {
    if (novoTipo === usuario.tipo) return;
    setErro(null);
    setProcessando(true);
    try {
      await onMudarTipo(usuario.id, novoTipo);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao alterar tipo.');
    } finally {
      setProcessando(false);
    }
  }

  return (
    <div className="tag-card flex flex-col gap-3 p-4 pl-7 sm:flex-row sm:items-center sm:justify-between">
      <span className="tag-hole" aria-hidden="true" />

      <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-inkfaded">Matrícula</div>
          <div className="font-mono text-base font-semibold">{usuario.matricula}</div>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <div className="text-[11px] uppercase tracking-wide text-inkfaded">Nome</div>
          {editando ? (
            <div className="flex items-center gap-1">
              <input
                className="w-full rounded border border-ink/25 bg-white px-2 py-1 text-sm"
                value={nomeEditado}
                onChange={(e) => setNomeEditado(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                onClick={salvarNome}
                disabled={processando}
                className="shrink-0 text-found"
                aria-label="Salvar nome"
              >
                ✓
              </button>
              <button
                type="button"
                onClick={() => {
                  setNomeEditado(usuario.nome);
                  setEditando(false);
                }}
                className="shrink-0 text-alert"
                aria-label="Cancelar edição"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-base">
              {usuario.nome}
              <button
                type="button"
                onClick={() => setEditando(true)}
                className="text-inkfaded hover:text-ink"
                aria-label="Editar nome"
                title="Editar nome"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wide text-inkfaded">Status</div>
          <button
            type="button"
            onClick={alternarStatus}
            disabled={processando || usuario.protegido}
            className="mt-0.5 flex items-center gap-1.5 text-sm font-medium disabled:opacity-50"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                usuario.status === 'ativo' ? 'bg-found' : 'bg-alert'
              }`}
              aria-hidden="true"
            />
            {usuario.status === 'ativo' ? 'Ativo' : 'Desativado'}
          </button>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wide text-inkfaded">Nível</div>
          <select
            value={usuario.tipo}
            onChange={(e) => mudarTipo(e.target.value as TipoUsuario)}
            disabled={processando || usuario.protegido}
            className="mt-0.5 rounded border border-ink/20 bg-white px-2 py-1 text-sm"
          >
            <option value="operario">Operário</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {souEu && (
        <span className="shrink-0 self-start rounded bg-amber/30 px-2 py-1 text-[11px] font-semibold uppercase text-ink sm:self-center">
          Você
        </span>
      )}

      {erro && <p className="w-full text-xs text-alert">{erro}</p>}
    </div>
  );
}