'use client';

const inputBase =
  'rounded-md border border-ink/20 bg-white px-3 py-2 text-sm text-ink placeholder:text-inkfaded/60 focus:border-ink';

interface FiltrosBarraProps {
  busca?: string;
  onBuscaChange?: (v: string) => void;
  data: string;
  onDataChange: (v: string) => void;
  cor?: string;
  onCorChange?: (v: string) => void;
  carrossel: string;
  onCarrosselChange: (v: string) => void;
  carrosseis: string[];
  turno: string;
  onTurnoChange: (v: string) => void;
  turnos: string[];
}

export default function FiltrosBarra({
  busca,
  onBuscaChange,
  data,
  onDataChange,
  cor,
  onCorChange,
  carrossel,
  onCarrosselChange,
  carrosseis,
  turno,
  onTurnoChange,
  turnos
}: FiltrosBarraProps) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {onBuscaChange !== undefined && (
        <input
          type="text"
          inputMode="numeric"
          placeholder="Buscar por número do saco"
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value.replace(/\D/g, ''))}
          maxLength={6}
          className={`${inputBase} w-full sm:w-56`}
        />
      )}

      <input
        type="date"
        aria-label="Filtrar por data"
        value={data}
        onChange={(e) => onDataChange(e.target.value)}
        className={`${inputBase} w-full sm:w-auto`}
      />

      {onCorChange !== undefined && (
        <input
          type="text"
          placeholder="Filtrar por cor"
          value={cor}
          onChange={(e) => onCorChange(e.target.value.toUpperCase())}
          className={`${inputBase} w-full sm:w-40`}
        />
      )}

      <select
        aria-label="Filtrar por carrossel"
        value={carrossel}
        onChange={(e) => onCarrosselChange(e.target.value)}
        className={`${inputBase} w-full sm:w-auto`}
      >
        <option value="">Todos os carrosséis</option>
        {carrosseis.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrar por turno"
        value={turno}
        onChange={(e) => onTurnoChange(e.target.value)}
        className={`${inputBase} w-full sm:w-auto`}
      >
        <option value="">Todos os turnos</option>
        {turnos.map((t) => (
          <option key={t} value={t}>
            {t}º turno
          </option>
        ))}
      </select>

      {(data || cor || carrossel || busca || turno) && (
        <button
          type="button"
          onClick={() => {
            onBuscaChange?.('');
            onDataChange('');
            onCorChange?.('');
            onCarrosselChange('');
            onTurnoChange('');
          }}
          className="rounded-md px-3 py-2 text-sm text-inkfaded underline underline-offset-2 hover:text-ink"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
