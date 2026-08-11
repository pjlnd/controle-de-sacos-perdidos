import { createHmac } from 'crypto';
import { cookies } from 'next/headers';

export const NOME_COOKIE = 'sessao';
const DIAS_EXPIRACAO = 30;
export const MAX_AGE_SEGUNDOS = DIAS_EXPIRACAO * 24 * 60 * 60;

function segredo(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) {
    throw new Error('Defina a variável de ambiente AUTH_SECRET (veja o .env.local).');
  }
  return s;
}

function assinar(matricula: string): string {
  return createHmac('sha256', segredo()).update(matricula).digest('hex');
}

/** Monta o valor do cookie: "matricula.assinatura" */
export function criarValorCookie(matricula: string): string {
  return `${matricula}.${assinar(matricula)}`;
}

/** Confere a assinatura e devolve a matrícula, ou null se for inválido/adulterado. */
export function validarValorCookie(valor: string | undefined | null): string | null {
  if (!valor) return null;
  const [matricula, assinatura] = valor.split('.');
  if (!matricula || !assinatura) return null;
  if (assinatura !== assinar(matricula)) return null;
  return matricula;
}

/** Lê o cookie da requisição atual e devolve a matrícula, já validada. */
export function obterMatriculaLogada(): string | null {
  const valor = cookies().get(NOME_COOKIE)?.value;
  return validarValorCookie(valor);
}