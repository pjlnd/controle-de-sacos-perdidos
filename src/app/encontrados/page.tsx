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
  const [filtroTurno, setFiltroTurno] = useState('')
  
  const encontrados = useMemo(() => sacos.filter((s) => s.status === 'encontrado'), [sacos]);
    
  const encontradosBase = useMemo(()=> {
    return encontrados.filter((s) => {
      if (busca && !s.numero.includes(busca)) return false
      if (filtroData && s.data !== filtroData) return false
      return true
    })
  }, [encontrados, busca, filtroData])
  
  const carrosseis = useMemo( () => {
    const lista = encontradosBase.filter((s) => !filtroTurno || s.turno === filtroTurno);
    return Array.from(new Set(lista.map((s) => s.carrossel))).sort();
  }, [encontradosBase, filtroTurno]);

  const turnosDisponiveis = useMemo(()=> {
    const lista = encontradosBase.filter((s) => !filtroCarrossel || s.carrossel === filtroCarrossel);
    return Array.from(new Set(lista.map((s) => s.turno))).sort()
  }, [encontradosBase, filtroCarrossel])

  const filtrados = useMemo(() => {
    return encontradosBase.filter((s) => {
      if (filtroCarrossel && s.carrossel !== filtroCarrossel) return false
      if (filtroTurno && s.turno !== filtroTurno) return false
      return true
    })
  }, [encontradosBase, filtroCarrossel, filtroTurno]);

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
        turno={filtroTurno}
        onTurnoChange={setFiltroTurno}
        turnos={turnosDisponiveis}
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
