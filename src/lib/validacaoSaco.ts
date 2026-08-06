import { CARROSSEIS, totalPrateleiras } from './carrosseis';
import type { NovoSacoInput } from './types';

export function validarCamposSaco(input: Partial<NovoSacoInput>): string | null {
  if (!input.numero || !/^\d{6}$/.test(input.numero)) {
    return 'Número do saco deve ter exatamente 6 dígitos.';
  }
  if (!input.artigo || !/^[A-Z0-9]{1,12}$/.test(input.artigo)) {
    return 'Artigo deve conter no máximo 12 caracteres, entre letras maiúsculas e números.';
  }
  if (!input.cor || !/^[A-Z0-9]{1,8}$/.test(input.cor)) {
    return 'Cor deve conter no máximo 8 caracteres, entre letras maiúsculas e números.';
  }
  if (!input.tamanho || !/^\d{1,2}$/.test(input.tamanho)) {
    return 'Tamanho deve ser numérico, com no máximo 2 dígitos.';
  }
  if (!input.turno || !['1', '2', '3'].includes(input.turno)) {
    return 'Turno deve ser 1, 2 ou 3.';
  }
  if (!input.data || !/^\d{4}-\d{2}-\d{2}$/.test(input.data)) {
    return 'Data inválida.';
  }
  if (!input.carrossel || !CARROSSEIS.includes(input.carrossel)) {
    return `Carrossel deve ser um de: ${CARROSSEIS.join(', ')}.`;
  }
  if (typeof input.retiradoPeloSistema !== 'boolean') {
    return 'Informe se o saco foi retirado pelo sistema.';
  }
  if (!input.retiradoPeloSistema) {
    const armazemNum = Number(input.armazem);
    if (!input.armazem || !Number.isInteger(armazemNum) || armazemNum < 1 || armazemNum > 72) {
      return 'Armazém deve ser um número entre 1 e 72.';
    }
    const maxPrateleiras = totalPrateleiras(input.carrossel);
    const prateleiraNum = Number(input.prateleira);
    if (
      !input.prateleira ||
      !Number.isInteger(prateleiraNum) ||
      prateleiraNum < 1 ||
      prateleiraNum > maxPrateleiras
    ) {
      return `Prateleira deve ser um número entre 1 e ${maxPrateleiras}.`;
    }
  }
  return null;
}