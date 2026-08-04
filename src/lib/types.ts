export type Turno = '1' | '2' | '3';
export type StatusSaco = 'perdido' | 'encontrado';

// Chave do carrossel, sempre "C01" até "C13"
export type CarrosselId = string;

/** Dados de um saco, do jeito que ficam guardados dentro de cada carrossel. */
export interface SacoDados {
  numero: string; // 6 dígitos
  artigo: string; // números com letras maiúsculas, até 12 caracteres
  cor: string; // números e/ou letras maiúsculas
  tamanho: string; // número
  turno: Turno;
  data: string; // yyyy-mm-dd
  retiradoPeloSistema: boolean;
  armazem?: string; // não existe se retiradoPeloSistema for true
  prateleira?: string; // idem
  motivo: 'Não encontrado';
  status: StatusSaco;
  criadoEm: string; // ISO timestamp
  encontradoEm?: string; // ISO timestamp
}

/** Cada carrossel guarda um objeto de sacos indexado pelo id numérico
 *  (o id reinicia em "1" dentro de cada carrossel). */
export interface CarrosselBucket {
  sacos: Record<string, SacoDados>;
}

/** Formato salvo em data/sacos.json:
 *  { "C01": { "sacos": { "1": {...}, "2": {...} } }, "C02": {...}, ... } */
export type BancoSacos = Record<CarrosselId, CarrosselBucket>;

/** Formato "achatado" usado pelo front-end e pelas respostas da API,
 *  já que a tela precisa filtrar/ordenar sacos de todos os carrosséis juntos. */
export interface SacoFlat extends SacoDados {
  id: string; // "C01-3" (chave composta, só para ter um id único na tela)
  carrossel: CarrosselId; // "C01"
  localId: number; // 3
}

export type NovoSacoInput = {
  numero: string;
  artigo: string;
  cor: string;
  tamanho: string;
  turno: Turno;
  data: string;
  carrossel: CarrosselId; // "C01" até "C13"
  retiradoPeloSistema: boolean;
  armazem?: string;
  prateleira?: string;
};