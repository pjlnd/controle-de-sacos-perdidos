'use client';

interface ConfirmDialogProps {
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export default function ConfirmDialog({
  titulo,
  mensagem,
  textoConfirmar = 'Confirmar',
  onCancelar,
  onConfirmar,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
      onClick={onCancelar}
    >
      <div
        className="tag-card w-full max-w-sm p-6 pl-8"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="tag-hole" aria-hidden="true" />

        <h2 className="font-stencil text-lg uppercase tracking-wide text-alert">
          {titulo}
        </h2>
        <p className="mt-2 text-sm text-inkfaded">{mensagem}</p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-md px-4 py-2 text-sm font-medium text-inkfaded hover:bg-black/5"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="rounded-md bg-alert px-4 py-2 text-sm font-semibold text-white hover:bg-alert/90"
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}