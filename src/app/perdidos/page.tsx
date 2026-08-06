'use client';

import Toast from '@/components/Toast';
import { useMemo, useState } from 'react';
import { useSacos } from '@/hooks/useSacos';
import SacoTag from '@/components/SacoTag';
import SacoModal from '@/components/SacoModal';
import FiltrosBarra from '@/components/Filters';
import EmptyState from '@/components/EmptyState';

export default function PerdidosPage() {
  const { sacos, carregando, erro, criarSaco, marcarEncontrado, excluirSaco } = useSacos();
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [filtroCarrossel, setFiltroCarrossel] = useState('');
  const [filtroTurno, setFiltroTurno] = useState('');
  const [toast, setToast] = useState<{ mensagem: string; variante: 'sucesso' | 'perigo' } | null>(null);
  const [toastKey, setToastKey] = useState(0);

  function dispararToast(mensagem: string, variante: 'sucesso' | 'perigo' = 'sucesso') {
    setToast({ mensagem, variante })
    setToastKey((k) => k + 1)
  }

  function handleEncontrado(id: string) {
    marcarEncontrado(id)
    dispararToast('Saco encontrado!')
  }

  function handleExcluir(id: string) {
    excluirSaco(id)
    dispararToast('Registro exlcuido', 'perigo')
  }

  const perdidos = useMemo(() => sacos.filter((s) => s.status === 'perdido'), [sacos]);

  const perdidosBase = useMemo(() => {
    return perdidos.filter((s) => {
      if (busca && !s.numero.includes(busca)) return false;
      if (filtroData && s.data !== filtroData) return false;
      return true;
    });
  }, [perdidos, busca, filtroData]);

  const carrosseis = useMemo(() => {
    const lista = perdidosBase.filter((s) => !filtroTurno || s.turno === filtroTurno);
    return Array.from(new Set(lista.map((s) => s.carrossel))).sort();
  }, [perdidosBase, filtroTurno]);

  const turnosDisponiveis = useMemo(() => {
    const lista = perdidosBase.filter((s) => !filtroCarrossel || s.carrossel === filtroCarrossel);
    return Array.from(new Set(lista.map((s) => s.turno))).sort();
  }, [perdidosBase, filtroCarrossel]);

  const filtrados = useMemo(() => {
    return perdidosBase.filter((s) => {
      if (filtroCarrossel && s.carrossel !== filtroCarrossel) return false;
      if (filtroTurno && s.turno !== filtroTurno) return false;
      return true;
    });
  }, [perdidosBase, filtroCarrossel, filtroTurno]);

  const totalPerdidos = filtrados.length;


  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-stencil text-2xl uppercase tracking-wide sm:text-3xl">
            Sacos perdidos
          </h1>
          <p className="text-sm text-inkfaded">
            <span className="font-mono font-semibold text-alert">{totalPerdidos}</span> saco(s) perdido(s)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          aria-label="Registrar novo saco perdido"
          className="flex h-11 w-11 items-center justify-center self-end rounded-full bg-alert text-2xl leading-none text-white shadow-md transition-transform hover:scale-105 sm:h-12 sm:w-12"
        >
          +
        </button>
      </div>

      <FiltrosBarra
        busca={busca}
        onBuscaChange={setBusca}
        data={filtroData}
        onDataChange={setFiltroData}
        carrossel={filtroCarrossel}
        onCarrosselChange={setFiltroCarrossel}
        carrosseis={carrosseis}
        turno={filtroTurno}
        onTurnoChange={setFiltroTurno}
        turnos={turnosDisponiveis}
      />

      {erro && (
        <p className="text-sm text-alert">{erro}</p>
      )}

      {carregando ? (
        <p className="py-10 text-center text-sm text-inkfaded">Carregando registros...</p>
      ) : filtrados.length === 0 ? (
        <EmptyState
          mensagem={perdidos.length === 0 ? 'Nenhum saco perdido' : 'Nenhum resultado para esse filtro'}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtrados.map((saco) => (
            <SacoTag key={saco.id} saco={saco} onEncontrado={handleEncontrado} onExcluir={handleExcluir} />
          ))}
        </div>
      )}

      {modalAberto && (
        <SacoModal onFechar={() => setModalAberto(false)} onSalvar={criarSaco} />
      )}

      {toast && (
        <Toast
          key={toastKey}
          mensagem={toast.mensagem}
          variante={toast.variante}
          onFechar={() => setToast(null)}
        />
      )}
    </div>
  );
}
