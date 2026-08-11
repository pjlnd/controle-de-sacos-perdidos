'use client';

import { useState } from 'react';
import type { NovoUsuarioInput, TipoUsuario } from '@/lib/types';

interface UsuarioModalProps {
  onFechar: () => void;
  onCriar: (input: NovoUsuarioInput) => Promise<void>;
}

const inputClass =
  'w-full rounded-md border border-ink/25 bg-white px-3 py-2 text-ink focus:border-ink';
const labelClass = 'text-xs font-medium uppercase tracking-wide text-inkfaded';

export default function UsuarioModal({ onFechar, onCriar }: UsuarioModalProps) {
  const [matricula, setMatricula] = useState('');
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<TipoUsuario>('operario');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!/^\d{1,9}$/.test(matricula)) {
      setErro('Matrícula deve conter apenas números, com no máximo 9 dígitos.');
      return;
    }
    if (!nome.trim()) {
      setErro('Informe o nome.');
      return;
    }

    setEnviando(true);
    try {
      await onCriar({ matricula, nome: nome.trim(), tipo });
      onFechar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao criar usuário.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4"
      onClick={onFechar}
    >
      <div
        className="w-full max-w-sm rounded-t-xl bg-kraft p-5 shadow-xl sm:rounded-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-stencil text-xl uppercase tracking-wide">Novo usuário</h2>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="rounded-full p-1 text-inkfaded hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className={labelClass}>Matrícula (até 9 dígitos)</label>
            <input
              className={`${inputClass} font-mono`}
              value={matricula}
              onChange={(e) => setMatricula(e.target.value.replace(/\D/g, '').slice(0, 9))}
              inputMode="numeric"
              placeholder="000000000"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Nome</label>
            <input
              className={inputClass}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Nível de acesso</label>
            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={() => setTipo('operario')}
                className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  tipo === 'operario'
                    ? 'border-ink bg-ink text-kraft'
                    : 'border-ink/25 bg-white text-inkfaded hover:bg-black/5'
                }`}
              >
                Operário
              </button>
              <button
                type="button"
                onClick={() => setTipo('admin')}
                className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  tipo === 'admin'
                    ? 'border-ink bg-ink text-kraft'
                    : 'border-ink/25 bg-white text-inkfaded hover:bg-black/5'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {erro && (
            <div className="rounded-md bg-alert/10 px-3 py-2 text-sm text-alert">{erro}</div>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onFechar}
              className="rounded-md px-4 py-2 text-sm font-medium text-inkfaded hover:bg-black/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-kraft hover:bg-ink/90 disabled:opacity-60"
            >
              {enviando ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}