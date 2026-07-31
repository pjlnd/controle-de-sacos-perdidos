import { NextRequest, NextResponse } from 'next/server';
import { CARROSSEIS, lerSacos, salvarNovoSaco } from '@/lib/db';
import type { NovoSacoInput } from '@/lib/types';

export const dynamic = 'force-dynamic';

function validar(input: Partial<NovoSacoInput>): string | null {
  if (!input.numero || !/^\d{6}$/.test(input.numero)) {
    return 'Número do saco deve ter exatamente 6 dígitos.';
  }
  if (!input.artigo || !/^[A-Z0-9]+$/.test(input.artigo)) {
    return 'Artigo deve conter no máximo 10 caracteres, entre letras maiúsculas e números.';
  }
  if (!input.cor || !/^[A-Z0-9]{1,8}$/.test(input.cor)) {
    return 'Cor deve conter no máximo 8 caracteres, entre letras maiúsculas e números.';
  }
  const tamanhoNum = Number(input.tamanho);
  if (!input.tamanho || !Number.isInteger(tamanhoNum) || tamanhoNum < 32 || tamanhoNum > 50) {
    return 'O tamanho deve ser um número entre 32 e 50.'
  }
  // if (!input.tamanho || !/^\d{1,2}$/.test(input.tamanho)) {
  //   return 'Tamanho deve ser numérico, com no máximo 2 dígitos.';
  // }
  if (!input.turno || !['1', '2', '3'].includes(input.turno)) {
    return 'Turno deve ser 1, 2 ou 3.';
  }
  if (!input.data || !/^\d{4}-\d{2}-\d{2}$/.test(input.data)) {
    return 'Data inválida.';
  }
  if (!input.carrossel || !CARROSSEIS.includes(input.carrossel)) {
    return `Carrossel deve ser um de: ${CARROSSEIS.join(', ')}.`;
  }
  const armazemNum = Number(input.armazem);
  if (!input.armazem || !Number.isInteger(armazemNum) || armazemNum < 1 || armazemNum > 72) {
    return 'Armazém deve ser um número entre 1 e 72.';
  }
  const prateleiraNum = Number(input.prateleira);
  if (!input.prateleira || !Number.isInteger(prateleiraNum) || prateleiraNum < 1 || prateleiraNum > 7) {
    return 'Prateleira deve ser um número entre 1 e 7.';
  }
  return null;
}

export async function GET() {
  const sacos = await lerSacos();
  return NextResponse.json(sacos);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<NovoSacoInput>;
  const erro = validar(body);
  if (erro) {
    return NextResponse.json({ erro }, { status: 400 });
  }

  const sacos = await salvarNovoSaco(body as NovoSacoInput);
  return NextResponse.json(sacos, { status: 201 });
}
