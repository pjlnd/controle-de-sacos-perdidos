'use client';

import { useState } from 'react';
import { useSessao } from '@/contexts/SessaoContext';
import { useUsuarios } from '@/hooks/useUsuarios';
import UsuarioModal from '@/components/UsuarioModal';
import UsuarioLinha from '@/components/UsuarioLinha';

export default function AdminPage() {
  const { sessao, carregando: carregandoSessao } = useSessao();
  const { usuarios, carregando, erro, criarUsuario, editarNome, alternarStatus, mudarTipo } =
    useUsuarios();
  const [modalAberto, setModalAberto] = useState(false);

  if (carregandoSessao) {
    return <p className="py-10 text-center text-sm text-inkfaded">Carregando...</p>;
  }

  if (!sessao.logado || sessao.tipo !== 'admin') {
    return (
      <div className="tag-card mx-auto max-w-md p-6 text-center">
        <h1 className="font-stencil text-xl uppercase tracking-wide text-alert">
          Acesso restrito
        </h1>
        <p className="mt-2 text-sm text-inkfaded">
          Essa página é exclusiva para administradores.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-stencil text-2xl uppercase tracking-wide sm:text-3xl">
          Gerenciar usuários
        </h1>
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          aria-label="Adicionar novo usuário"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-2xl leading-none text-kraft shadow-md transition-transform hover:scale-105"
        >
          +
        </button>
      </div>

      {erro && <p className="text-sm text-alert">{erro}</p>}

      {carregando ? (
        <p className="py-10 text-center text-sm text-inkfaded">Carregando usuários...</p>
      ) : usuarios.length === 0 ? (
        <p className="py-10 text-center text-sm text-inkfaded">Nenhum usuário cadastrado.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {usuarios.map((usuario) => (
            <UsuarioLinha
              key={usuario.id}
              usuario={usuario}
              souEu={usuario.matricula === sessao.matricula}
              onEditarNome={editarNome}
              onAlternarStatus={alternarStatus}
              onMudarTipo={mudarTipo}
            />
          ))}
        </div>
      )}

      {modalAberto && (
        <UsuarioModal onFechar={() => setModalAberto(false)} onCriar={criarUsuario} />
      )}
    </div>
  );
}