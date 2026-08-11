import { NextResponse } from 'next/server';
import { obterMatriculaLogada } from '@/lib/sessao';
import { buscarUsuarioPorMatricula } from '@/lib/usuarios';

export const dynamic = 'force-dynamic';

export async function GET() {
  const matricula = obterMatriculaLogada();
  if (!matricula) {
    return NextResponse.json({ logado: false });
  }

  // Nunca confia só no cookie -- confere de novo no banco, já que o status
  // ou o tipo do usuário podem ter mudado desde que ele logou.
  const usuario = await buscarUsuarioPorMatricula(matricula);
  if (!usuario || usuario.status === 'inativo') {
    return NextResponse.json({ logado: false });
  }

  return NextResponse.json({
    logado: true,
    matricula: usuario.matricula,
    nome: usuario.nome,
    tipo: usuario.tipo,
  });
}