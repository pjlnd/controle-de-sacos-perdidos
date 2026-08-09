import { NextRequest, NextResponse } from 'next/server';
import { criarUsuario, listarUsuarios } from '@/lib/usuarios';
import { validarNovoUsuario } from '@/lib/validacaoUsuario';
import type { NovoUsuarioInput } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const usuarios = await listarUsuarios();
  return NextResponse.json(usuarios);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<NovoUsuarioInput>;
  const erro = validarNovoUsuario(body);
  if (erro) {
    return NextResponse.json({ erro }, { status: 400 });
  }

  try {
    const usuarios = await criarUsuario(body as NovoUsuarioInput);
    return NextResponse.json(usuarios, { status: 201 });
  } catch (e) {
    // Matrícula duplicada, por exemplo -- erro lançado pelo usuarios.ts
    return NextResponse.json({ erro: (e as Error).message }, { status: 409 });
  }
}