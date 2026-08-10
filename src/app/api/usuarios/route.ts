import { NextRequest, NextResponse } from 'next/server';
import { criarUsuario, listarUsuarios } from '@/lib/usuarios';
import { validarNovoUsuario } from '@/lib/validacaoUsuario';
import { respostaNaoAutorizado, respostaSemPermissao, usuarioAutenticado } from '@/lib/autenticacao';
import type { NovoUsuarioInput } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const usuario = await usuarioAutenticado();
  if (!usuario) return respostaNaoAutorizado();
  if (usuario.tipo !== 'admin') return respostaSemPermissao();

  const usuarios = await listarUsuarios();
  return NextResponse.json(usuarios);
}

export async function POST(req: NextRequest) {
  const usuarioLogado = await usuarioAutenticado();
  if (!usuarioLogado) return respostaNaoAutorizado();
  if (usuarioLogado.tipo !== 'admin') return respostaSemPermissao();

  const body = (await req.json()) as Partial<NovoUsuarioInput>;
  const erro = validarNovoUsuario(body);
  if (erro) {
    return NextResponse.json({ erro }, { status: 400 });
  }

  try {
    const usuarios = await criarUsuario(body as NovoUsuarioInput);
    return NextResponse.json(usuarios, { status: 201 });
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 409 });
  }
}