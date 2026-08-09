import { NextRequest, NextResponse } from 'next/server';
import { buscarUsuarioPorMatricula } from '@/lib/usuarios';
import { criarValorCookie, MAX_AGE_SEGUNDOS, NOME_COOKIE } from '@/lib/sessao';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { matricula } = (await req.json()) as { matricula?: string };

  if (!matricula || !/^\d{1,9}$/.test(matricula)) {
    return NextResponse.json({ erro: 'Matrícula inválida.' }, { status: 400 });
  }

  const usuario = await buscarUsuarioPorMatricula(matricula);
  if (!usuario) {
    return NextResponse.json({ erro: 'Matrícula não encontrada.' }, { status: 404 });
  }
  if (usuario.status === 'inativo') {
    return NextResponse.json({ erro: 'Esse usuário está desativado.' }, { status: 403 });
  }

  const resposta = NextResponse.json({
    matricula: usuario.matricula,
    nome: usuario.nome,
    tipo: usuario.tipo,
  });

  resposta.cookies.set(NOME_COOKIE, criarValorCookie(usuario.matricula), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SEGUNDOS,
  });

  return resposta;
}