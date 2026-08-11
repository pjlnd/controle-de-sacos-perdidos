import type { NovoUsuarioInput } from './types';

export function validarNovoUsuario(input: Partial<NovoUsuarioInput>): string | null {
  if (!input.matricula || !/^\d{1,9}$/.test(input.matricula)) {
    return 'Matrícula deve conter apenas números, com no máximo 9 dígitos.';
  }
  if (!input.nome || !input.nome.trim()) {
    return 'Nome é obrigatório.';
  }
  if (!input.tipo || !['admin', 'operario'].includes(input.tipo)) {
    return 'Tipo deve ser "admin" ou "operario".';
  }
  return null;
}