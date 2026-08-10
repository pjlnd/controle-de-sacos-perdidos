import { NextRequest, NextResponse } from 'next/server';
import { atualizarStatusSaco, editarSaco, excluirSaco, lerSacos } from '@/lib/db';
import { podeEditar } from '@/lib/prazoEdicao';
import { validarCamposSaco } from '@/lib/validacaoSaco';
import { respostaNaoAutorizado, usuarioAutenticado } from '@/lib/autenticacao';
import type { EditarSacoInput } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const usuario = usuarioAutenticado();
  if (!usuario) return respostaNaoAutorizado();

  const body = await req.json();

  // Edição completa (vinda do modal) -- identificada pela presença do campo "numero"
  if ('numero' in body) {
    const input = body as Partial<EditarSacoInput>;

    const erroValidacao = validarCamposSaco(input);
    if (erroValidacao) {
      return NextResponse.json({ erro: erroValidacao }, { status: 400 });
    }
    if (!input.status || !['perdido', 'encontrado'].includes(input.status)) {
      return NextResponse.json({ erro: 'Status inválido.' }, { status: 400 });
    }

    // Confere o prazo de 24h antes de aplicar a edição
    const sacosAtuais = await lerSacos();
    const sacoExistente = sacosAtuais.find((s) => s.id === params.id);
    if (!sacoExistente) {
      return NextResponse.json({ erro: 'Saco não encontrado.' }, { status: 404 });
    }
    if (!podeEditar(sacoExistente.criadoEm)) {
      return NextResponse.json(
        { erro: 'Esse registro só pode ser editado até 24 horas depois de criado.' },
        { status: 403 }
      );
    }

    const sacos = await editarSaco(params.id, input as EditarSacoInput);
    if (!sacos) {
      return NextResponse.json({ erro: 'Saco não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(sacos);
  }

  // Atualização rápida de status (botão "Marcar como encontrado")
  const { status } = body as { status?: 'perdido' | 'encontrado' };
  if (!status || !['perdido', 'encontrado'].includes(status)) {
    return NextResponse.json({ erro: 'Status inválido.' }, { status: 400 });
  }

  const sacos = await atualizarStatusSaco(params.id, status);
  if (!sacos) {
    return NextResponse.json({ erro: 'Saco não encontrado.' }, { status: 404 });
  }
  return NextResponse.json(sacos);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const usuario = usuarioAutenticado();
  if (!usuario) return respostaNaoAutorizado();

  const sacos = await excluirSaco(params.id);
  if (!sacos) {
    return NextResponse.json({ erro: 'Saco não encontrado.' }, { status: 404 });
  }
  return NextResponse.json(sacos);
}