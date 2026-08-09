import { NextResponse } from 'next/server';
import { NOME_COOKIE } from '@/lib/sessao';

export const dynamic = 'force-dynamic';

export async function POST() {
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(NOME_COOKIE, '', { path: '/', maxAge: 0 });
  return resposta;
}