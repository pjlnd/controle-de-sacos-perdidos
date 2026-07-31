export default function EmptyState({ mensagem }: { mensagem: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
      <div className="font-stencil text-2xl uppercase tracking-wide text-inkfaded sm:text-3xl">
        {mensagem}
      </div>
    </div>
  );
}
