'use client';

import { useState } from 'react';

interface SacoMenuProps {
  podeEditar: boolean;
  onEditar: () => void;
  onExcluir: () => void;
}

export default function SacoMenu({ podeEditar, onEditar, onExcluir }: SacoMenuProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-label="Mais opções"
        aria-haspopup="true"
        aria-expanded={aberto}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-ink/20 text-ink transition-colors hover:bg-black/5"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="5" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="12" cy="19" r="1.8" />
        </svg>
      </button>

      {aberto && (
        <>
          {/* Camada invisível que cobre a tela inteira, só pra fechar o
              menu quando clicar em qualquer lugar fora dele. */}
          <div className="fixed inset-0 z-10" onClick={() => setAberto(false)} />

          <div className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-md border border-ink/15 bg-white shadow-lg">
            <button
              type="button"
              disabled={!podeEditar}
              onClick={() => {
                setAberto(false);
                onEditar();
              }}
              title={podeEditar ? undefined : 'Prazo de edição de 24h expirado'}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-ink transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:text-inkfaded/40 disabled:hover:bg-transparent"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Editar
              {!podeEditar && <span className="ml-auto text-[10px] text-inkfaded/60">24h</span>}
            </button>

            <button
              type="button"
              onClick={() => {
                setAberto(false);
                onExcluir();
              }}
              className="flex w-full items-center gap-2 border-t border-ink/10 px-3 py-2.5 text-left text-sm text-alert transition-colors hover:bg-alert/10"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7h10Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Excluir
            </button>
          </div>
        </>
      )}
    </div>
  );
}