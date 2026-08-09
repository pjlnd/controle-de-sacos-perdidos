export type Turno = '1' | '2' | '3';
export type StatusSaco = 'perdido' | 'encontrado';

export type TipoUsuario = 'admin' | 'operario';
export type StatusUsuario = 'ativo' | 'inativo'

export interface UsuarioDados {
  matricula: string // até 9 dígitos, apenas números
  nome: string
  tipo: TipoUsuario
  status: StatusUsuario
  criadoEm: string // ISO timestamp
}

export interface UsuarioFlat extends UsuarioDados {
  id: string
}

export interface NovoUsuarioInput {
  matricula: string
  nome: string
  tipo: TipoUsuario
}

// Código do carrossel, sempre "C01" até "C13"
export type CarrosselId = string;

/** Dados de um saco, do jeito que ficam guardados como documento no MongoDB
 *  (sem o _id, que o Mongo já gera sozinho). */
export interface SacoDados {
  numero: string; // 6 dígitos
  artigo: string; // números com letras maiúsculas, até 12 caracteres
  cor: string; // números e/ou letras maiúsculas, até 8 caracteres
  tamanho: string; // número
  turno: Turno;
  data: string; // yyyy-mm-dd
  carrossel: CarrosselId; // "C01" até "C13"
  retiradoPeloSistema: boolean;
  armazem?: string; // não existe se retiradoPeloSistema for true
  prateleira?: string; // idem
  motivo: 'Não encontrado';
  status: StatusSaco;
  criadoEm: string; // ISO timestamp
  encontradoEm?: string; // ISO timestamp
}

/** Formato usado pelo front-end e pelas respostas da API — o id agora é o
 *  ObjectId do MongoDB, convertido pra string. */
export interface SacoFlat extends SacoDados {
  id: string;
}

export type NovoSacoInput = Omit<
  SacoDados,
  'motivo' | 'status' | 'criadoEm' | 'encontradoEm'
>;

export type EditarSacoInput = NovoSacoInput & { status: StatusSaco }