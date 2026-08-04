'use client';

import { useState } from 'react';
import type { SacoFlat } from '@/lib/types';
import ConfirmDialog from './ConfirmDialog';

function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

interface SacoTagProps {
  saco: SacoFlat;
  onEncontrado?: (id: string) => void;
  onExcluir?: (id: string) => void;
}

export default function SacoTag({ saco, onEncontrado, onExcluir }: SacoTagProps) {
  const [confirmando, setConfirmando] = useState(false);
  return (
    <div className="tag-card flex flex-col gap-3 p-4 pl-7 sm:flex-row sm:items-center sm:justify-between">
      <span className="tag-hole" aria-hidden="true" />

      <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-inkfaded">
            Nº do saco
          </div>
          <div className="font-mono text-base font-semibold">{saco.numero}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-inkfaded">
            Cor / Tam.
          </div>
          <div className="font-mono text-base">
            {saco.cor} · {saco.tamanho}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-inkfaded">
            Carrossel
          </div>
          <div className="text-base">{saco.carrossel}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-inkfaded">
            Armazém / Prat.
          </div>
          {saco.retiradoPeloSistema ? (
            <div className="text-base italic text-inkfaded/70">Retirado pelo sistema</div>
          ) : (
            <div className="text-base">
              {saco.armazem} / {saco.prateleira}
            </div>
          )}
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-inkfaded">
            Turno
          </div>
          <div className="text-base">{saco.turno}º turno</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-inkfaded">
            Data
          </div>
          <div className="text-base">{formatarData(saco.data)}</div>
        </div>
        <div className="col-span-2 sm:col-span-2">
          <div className="text-[11px] uppercase tracking-wide text-inkfaded">
            Artigo
          </div>
          <div className="font-mono text-base">{saco.artigo}</div>
        </div>
      </div>

      {onEncontrado ? (
        <button
          type="button"
          onClick={() => onEncontrado(saco.id)}
          className="flex shrink-0 items-center justify-center gap-2 self-stretch rounded-md bg-found px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-found/90 hover:shadow active:scale-[0.97] sm:self-center"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Marcar como encontrado
        </button>
      ) : (
        <span className="stamp shrink-0 self-start rounded border-2 border-found px-3 py-1.5 text-sm font-bold uppercase text-found sm:self-center">
          Encontrado
        </span>
      )}

      {onExcluir && (
        <button
          type='button'
          onClick={() => { setConfirmando(true) }}
          aria-label="Excluir registro"
          title="Excluir registro"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-alert/40 text-alert transition-colors hover:bg-alert hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7h10Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {confirmando && onExcluir && (
        <ConfirmDialog
          titulo="Excluir registro"
          mensagem={`Excluir o registro do saco ${saco.numero}? Essa ação não pode ser desfeita.`}
          textoConfirmar="Excluir"
          onCancelar={() => setConfirmando(false)}
          onConfirmar={() => {
            setConfirmando(false);
            onExcluir(saco.id);
          }}
        />
      )}
    </div>
  );
}
