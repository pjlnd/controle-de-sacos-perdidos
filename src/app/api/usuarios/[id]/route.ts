import { NextRequest, NextResponse } from 'next/server';
import { alternarStatusUsuario, editarNomeUsuario, mudarTipoUsuario } from '@/lib/usuarios';
import { respostaNaoAutorizado, respostaSemPermissao, usuarioAutenticado } from '@/lib/autenticacao';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const usuarioLogado = await usuarioAutenticado()
  if (!usuarioLogado) return respostaNaoAutorizado()
  if (usuarioLogado.tipo !== 'admin') return respostaSemPermissao()

  const body = await req.json();

  try {
    if ('nome' in body) {
      const nome = String(body.nome ?? '').trim();
      if (!nome) {
        return NextResponse.json({ erro: 'Nome não pode ficar em branco.' }, { status: 400 });
      }
      const usuarios = await editarNomeUsuario(params.id, nome);
      if (!usuarios) {
        return NextResponse.json({ erro: 'Usuário não encontrado.' }, { status: 404 });
      }
      return NextResponse.json(usuarios);
    }

    if ('status' in body) {
      if (!['ativo', 'inativo'].includes(body.status)) {
        return NextResponse.json({ erro: 'Status inválido.' }, { status: 400 });
      }
      const usuarios = await alternarStatusUsuario(params.id, body.status);
      if (!usuarios) {
        return NextResponse.json({ erro: 'Usuário não encontrado.' }, { status: 404 });
      }
      return NextResponse.json(usuarios);
    }

    if ('tipo' in body) {
      if (!['admin', 'operario'].includes(body.tipo)) {
        return NextResponse.json({ erro: 'Tipo inválido.' }, { status: 400 });
      }
      const usuarios = await mudarTipoUsuario(params.id, body.tipo);
      if (!usuarios) {
        return NextResponse.json({ erro: 'Usuário não encontrado.' }, { status: 404 });
      }
      return NextResponse.json(usuarios);
    }

    return NextResponse.json({ erro: 'Nenhum campo válido enviado.' }, { status: 400 });
  } catch (e) {
    // Trava de "último admin", por exemplo -- erro lançado pelo usuarios.ts
    return NextResponse.json({ erro: (e as Error).message }, { status: 409 });
  }
}