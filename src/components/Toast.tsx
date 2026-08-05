'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  mensagem: string;
  onFechar: () => void;
}

const DURACAO_VISIVEL_MS = 5000;
const DURACAO_FADE_MS = 300;

export default function Toast({ mensagem, onFechar }: ToastProps) {
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

  return (
    <div
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-all duration-300 ${
        saindo ? '-translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="flex items-center gap-2 rounded-full bg-found px-4 py-2.5 text-sm font-medium text-white shadow-lg">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {mensagem}
      </div>
    </div>
  );
}