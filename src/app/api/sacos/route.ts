import { NextRequest, NextResponse } from 'next/server';
import { lerSacos, salvarNovoSaco } from '@/lib/db';
import { validarCamposSaco } from '@/lib/validacaoSaco';
import type { NovoSacoInput } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sacos = await lerSacos();
  return NextResponse.json(sacos);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<NovoSacoInput>;
  const erro = validarCamposSaco(body);
  if (erro) {
    return NextResponse.json({ erro }, { status: 400 });
  }

  const sacos = await salvarNovoSaco(body as NovoSacoInput);
  return NextResponse.json(sacos, { status: 201 });
}