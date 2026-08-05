export function carrosselKey(n: number): string {
  return `C${String(n).padStart(2, '0')}`;
}

export function formatarCarrossel(numeros: number[]) {
  return numeros.map(numero => `C${numero.toString().padStart(2, "0")}`)
}

const TOTAL_CARROSSEIS = 13; // C01 até C13

export const CARROSSEIS: string[] = Array.from({ length: TOTAL_CARROSSEIS }, (_, i) =>
  carrosselKey(i + 1)
);

export const CARROSSEIS_COM_8_PRATELEIRAS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const CARROSSEIS_FILTRADOS: string[] = formatarCarrossel(CARROSSEIS_COM_8_PRATELEIRAS);

export function totalPrateleiras(carrossel: string): number {
  return CARROSSEIS_FILTRADOS.includes(carrossel) ? 8 : 7;
}