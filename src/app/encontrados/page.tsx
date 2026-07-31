'use client';

import { useMemo, useState } from 'react';
import { useSacos } from '@/hooks/useSacos';
import SacoTag from '@/components/SacoTag';
import FiltrosBarra from '@/components/Filters';
import EmptyState from '@/components/EmptyState';

export default function EncontradosPage() {
  const { sacos, carregando, erro, excluirSaco } = useSacos();
  const [busca, setBusca] = useState('')
  const [filtroData, setFiltroData] = useState('');
  const [filtroCarrossel, setFiltroCarrossel] = useState('');

  const encontrados = useMemo(() => sacos.filter((s) => s.status === 'encontrado'), [sacos]);

  const carrosseis = useMemo(
    () => Array.from(new Set(encontrados.map((s) => s.carrossel))).sort(),
    [encontrados]
  );

  const filtrados = useMemo(() => {
    return encontrados.filter((s) => {
      if (filtroData && s.data !== filtroData) return false;
      if (busca && !s.numero.includes(busca)) return false;
      if (filtroCarrossel && s.carrossel !== filtroCarrossel) return false;
      return true;
    });
  }, [encontrados, busca, filtroData, filtroCarrossel]);

  const totalEncontrados = filtrados.length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-stencil text-2xl uppercase tracking-wide sm:text-3xl">
          Sacos encontrados
        </h1>
        <p className="text-sm text-inkfaded">
          <span className="font-mono font-semibold text-found">{totalEncontrados}</span> saco(s) encontrado(s)
        </p>
      </div>

      <FiltrosBarra
        data={filtroData}
        onDataChange={setFiltroData}
        busca={busca}
        onBuscaChange={setBusca}
        carrossel={filtroCarrossel}
        onCarrosselChange={setFiltroCarrossel}
        carrosseis={carrosseis}
      />

      {erro && <p className="text-sm text-alert">{erro}</p>}

      {carregando ? (
        <p className="py-10 text-center text-sm text-inkfaded">Carregando registros...</p>
      ) : filtrados.length === 0 ? (
        <EmptyState
          mensagem={encontrados.length === 0 ? 'Nenhum saco encontrado ainda' : 'Nenhum resultado para esse filtro'}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtrados.map((saco) => (
            <SacoTag key={saco.id} saco={saco} onExcluir={excluirSaco}/>
          ))}
        </div>
      )}
    </div>
  );
}
