'use client';

import { useState } from 'react';
import type { NovoSacoInput, Turno } from '@/lib/types';
import { CARROSSEIS, totalPrateleiras } from '@/lib/carrosseis';

// const CARROSSEIS = Array.from({ length: 13 }, (_, i) => `C${String(i + 1).padStart(2, '0')}`);

function hoje(): string {
  const d = new Date();
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

const estadoInicial: NovoSacoInput = {
  numero: '',
  artigo: '',
  cor: '',
  tamanho: '',
  turno: '1',
  data: hoje(),
  carrossel: 'C01',
  retiradoPeloSistema: false,
  armazem: '',
  prateleira: '',
};

interface SacoModalProps {
  onFechar: () => void;
  onSalvar: (input: NovoSacoInput) => Promise<void>;
}

const inputClass =
  'w-full rounded-md border border-ink/25 bg-white px-3 py-2 text-ink focus:border-ink';
const labelClass = 'text-xs font-medium uppercase tracking-wide text-inkfaded';

export default function SacoModal({ onFechar, onSalvar }: SacoModalProps) {
  const [form, setForm] = useState<NovoSacoInput>(estadoInicial);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function atualizar<K extends keyof NovoSacoInput>(campo: K, valor: NovoSacoInput[K]) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!/^\d{6}$/.test(form.numero)) {
      setErro('O número do saco deve ter exatamente 6 dígitos.');
      return;
    }
    if (!/^[A-Z0-9]{1,12}$/.test(form.artigo)) {
      setErro('O artigo deve conter no máximo 12 caracteres, entre letras maiúsculas e números.');
      return;
    }
    if (!/^[A-Z0-9]{1,8}$/.test(form.cor)) {
      setErro('A cor deve conter no máximo 8 caracteres, entre letras maiúsculas e números.');
      return;
    }
    const tamanhoNum = Number(form.tamanho);
    if (!form.tamanho || !Number.isInteger(tamanhoNum) || tamanhoNum < 32 || tamanhoNum > 50) {
      setErro('O tamanho deve ser um número entre 32 e 50.');
      return
    }
    if (!form.retiradoPeloSistema) {
      const armazemNum = Number(form.armazem);
      if (!form.armazem || !Number.isInteger(armazemNum) || armazemNum < 1 || armazemNum > 72) {
        setErro('O armazém deve ser um número entre 1 e 72.');
        return;
      }
      const maxPrateleiras = totalPrateleiras(form.carrossel);
      const prateleiraNum = Number(form.prateleira);
      if (
        !form.prateleira ||
        !Number.isInteger(prateleiraNum) ||
        prateleiraNum < 1 ||
        prateleiraNum > maxPrateleiras
      ) {
        setErro(`A prateleira deve ser um número entre 1 e ${maxPrateleiras}.`);
        return;
      }
    }

    setEnviando(true);
    try {
      const payload: NovoSacoInput = form.retiradoPeloSistema
        ? { ...form, armazem: undefined, prateleira: undefined }
        : form;
      await onSalvar(payload);
      onFechar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao registrar saco.');
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
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-xl bg-kraft p-5 shadow-xl sm:max-w-lg sm:rounded-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-stencil text-xl uppercase tracking-wide">
            Novo saco perdido
          </h2>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="rounded-full p-1 text-inkfaded hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className={labelClass}>Número do saco</label>
            <input
              className={`${inputClass} font-mono`}
              value={form.numero}
              onChange={(e) => atualizar('numero', e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              placeholder="000000"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className={labelClass}>Artigo</label>
            <input
              className={`${inputClass} font-mono uppercase`}
              value={form.artigo}
              onChange={(e) => atualizar('artigo', e.target.value.toUpperCase().slice(0, 12))}
              placeholder="Ex.: A2231B"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Cor</label>
            <input
              className={`${inputClass} font-mono uppercase`}
              value={form.cor}
              onChange={(e) => atualizar('cor', e.target.value.toUpperCase().slice(0, 8))}
              placeholder="Ex.: AZ01"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Tamanho</label>
            <input
              className={inputClass}
              value={form.tamanho}
              onChange={(e) => atualizar('tamanho', e.target.value.replace(/\D/g, '').slice(0, 2))}
              inputMode="numeric"
              placeholder="Ex.: 42"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Turno</label>
            <select
              className={inputClass}
              value={form.turno}
              onChange={(e) => atualizar('turno', e.target.value as Turno)}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Data</label>
            <input
              type="date"
              className={inputClass}
              value={form.data}
              onChange={(e) => atualizar('data', e.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Carrossel</label>
            <select
              className={inputClass}
              value={form.carrossel}
              onChange={(e) => {
                const novoCarrossel = e.target.value;
                setForm((f) => {
                  const max = totalPrateleiras(novoCarrossel);
                  const prateleiraFoiInvalidada = Number(f.prateleira) > max;
                  return {
                    ...f,
                    carrossel: novoCarrossel,
                    prateleira: prateleiraFoiInvalidada ? '' : f.prateleira,
                  };
                });
              }}
            >
              {CARROSSEIS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className={labelClass}>Retirado pelo sistema?</label>
            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={() => atualizar('retiradoPeloSistema', false)}
                className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  !form.retiradoPeloSistema
                    ? 'border-ink bg-ink text-kraft'
                    : 'border-ink/25 bg-white text-inkfaded hover:bg-black/5'
                }`}
              >
                Não
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, retiradoPeloSistema: true, armazem: '', prateleira: '' }))
                }
                className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  form.retiradoPeloSistema
                    ? 'border-ink bg-ink text-kraft'
                    : 'border-ink/25 bg-white text-inkfaded hover:bg-black/5'
                }`}
              >
                Sim
              </button>
            </div>
          </div>

          {!form.retiradoPeloSistema && (
            <>
              <div>
                <label className={labelClass}>Armazém</label>
                <input
                  className={inputClass}
                  value={form.armazem ?? ''}
                  onChange={(e) =>
                    atualizar('armazem', e.target.value.replace(/\D/g, '').slice(0, 2))
                  }
                  inputMode="numeric"
                  placeholder="Ex.: 2"
                  required
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>
                  Prateleira
                </label>
                <select
                  className={inputClass}
                  value={form.prateleira ?? ''}
                  onChange={(e) => atualizar('prateleira', e.target.value)}
                >
                  <option value="">Selecione</option>
                  {Array.from({ length: totalPrateleiras(form.carrossel) }, (_, i) =>
                    String(i + 1)
                  ).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="col-span-2">
            <label className={labelClass}>Motivo</label>
            <input
              className={`${inputClass} bg-kraftdark/40 text-inkfaded`}
              value="Não encontrado"
              disabled
            />
          </div>

          {erro && (
            <div className="col-span-2 rounded-md bg-alert/10 px-3 py-2 text-sm text-alert">
              {erro}
            </div>
          )}

          <div className="col-span-2 mt-2 flex justify-end gap-2">
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
              {enviando ? 'Salvando...' : 'Concluir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
