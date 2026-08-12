import { NextRequest, NextResponse } from 'next/server';
import { atualizarStatusSaco, excluirSaco } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = (await req.json()) as { status?: 'perdido' | 'encontrado' };
  if (!body.status || !['perdido', 'encontrado'].includes(body.status)) {
    return NextResponse.json({ erro: 'Status inválido.' }, { status: 400 });
  }

  const sacos = await atualizarStatusSaco(params.id, body.status);
  if (!sacos) {
    return NextResponse.json(
      { erro: 'Saco não encontrado.' },
      { status: 404 }
    );
  }
  return NextResponse.json(sacos);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const sacos = await excluirSaco(params.id);
  if (!sacos) {
    return NextResponse.json(
      { erro: 'Saco não encontrado.' },
      { status: 404 }
    );
  }
  return NextResponse.json(sacos);
}