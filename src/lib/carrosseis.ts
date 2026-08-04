export function carrosselKey(n: number): string {
  return `C${String(n).padStart(2, '0')}`;
}

// Ajuste esse número quando adicionarem mais carrosséis no futuro.
const TOTAL_CARROSSEIS = 13; // C01 até C13

export const CARROSSEIS: string[] = Array.from({ length: TOTAL_CARROSSEIS }, (_, i) =>
  carrosselKey(i + 1)
);

// Carrosséis cujo armazém tem até 8 prateleiras (em vez de 7).
// Ainda não sabemos exatamente quais são -- por enquanto, assumimos que
// TODOS têm até 8. Assim que souber quais são a exceção, é só listar os
// códigos aqui (ex.: ['C01', 'C05']) que o resto do app se ajusta sozinho.
export const CARROSSEIS_COM_8_PRATELEIRAS: string[] = [...CARROSSEIS];

export function totalPrateleiras(carrossel: string): number {
  return CARROSSEIS_COM_8_PRATELEIRAS.includes(carrossel) ? 8 : 7;
}