'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  mensagem: string;
  variante?: 'sucesso' | 'perigo';
  onFechar: () => void;
}

const DURACAO_VISIVEL_MS = 5000;
const DURACAO_FADE_MS = 300;

export default function Toast({ mensagem, variante = 'sucesso', onFechar }: ToastProps) {
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSaindo(true), DURACAO_VISIVEL_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!saindo) return;
    const timer = setTimeout(onFechar, DURACAO_FADE_MS);
    return () => clearTimeout(timer);
  }, [saindo, onFechar]);

  const corFundo = variante === 'perigo' ? 'bg-alert' : 'bg-found';

  return (
    <div
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-all duration-300 ${
        saindo ? '-translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className={`flex items-center gap-2 rounded-full ${corFundo} px-4 py-2.5 text-sm font-medium text-white shadow-lg`}>
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
          {variante === 'perigo' ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7h10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        {mensagem}
      </div>
    </div>
  );
}